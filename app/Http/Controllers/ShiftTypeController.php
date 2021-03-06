<?php

namespace Lara\Http\Controllers;

use Illuminate\Http\Request;
use Log;
use Redirect;
use Session;
use View;

use Lara\Shift;
use Lara\ShiftType;


class ShiftTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function find($query = NULL)
    {
        if ( is_null($query) ) { $query = ""; } // if no parameter specified - empty means "show all"

        $shiftTypes =  ShiftType::where('title', 'like', '%' . $query . '%')
            ->orderBy('title')
            ->get([
                'title',
                'start',
                'end',
                'statistical_weight'
            ]);

        return response()->json($shiftTypes);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $shiftTypes = ShiftType::orderBy('title', 'ASC')->paginate(25);

        return view('manageShiftTypesView', ['shiftTypes' => $shiftTypes]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        // get selected shiftTypes
        $current_shiftType = ShiftType::findOrFail($id);

        // get a list of all available job types
        $shiftTypes = ShiftType::orderBy('title', 'ASC')->get();

        $shifts = Shift::where('shifttype_id', '=', $id)
            ->with('schedule.event.section')
            ->paginate(25);

        return View::make('shiftTypeView', compact('current_shiftType', 'shiftTypes', 'shifts'));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        // Check credentials: you can only edit, if you have rights for marketing, section management or admin
        if(!Session::has('userId')
            OR (Session::get('userGroup') != 'marketing'
                AND Session::get('userGroup') != 'clubleitung'
                AND Session::get('userGroup') != 'admin'))
        {
            Session::put('message', trans('mainLang.cantTouchThis'));
            Session::put('msgType', 'danger');
            return Redirect::back();
        }

        // Get all the data (throws a 404 error if shiftType doesn't exist)
        $shiftType = ShiftType::findOrFail($id);

        // Extract request data
        $newTitle       = $request->get('title'.$id);
        $newTimeStart   = $request->get('start'.$id);
        $newTimeEnd     = $request->get('end'.$id);
        $newWeight      = $request->get('statistical_weight'.$id);

        // Check for empty values
        if (empty($newTitle) || empty($newTimeStart) || empty($newTimeEnd)) {
            Session::put('message', trans('mainLang.cantBeBlank'));
            Session::put('msgType', 'danger');
            return Redirect::back();
        }

        // Statistical weight must be numerical
        if (!is_numeric($newWeight)) {
            Session::put('message', trans('mainLang.nonNumericStats'));
            Session::put('msgType', 'danger');
            return Redirect::back();
        }

        // Statistical weight must be non-negative
        if ($newWeight < 0.0) {
            Session::put('message', trans('mainLang.negativeStats'));
            Session::put('msgType', 'danger');
            return Redirect::back();
        }

        // Log the action while we still have the data
        Log::info('ShiftType edited: ' .
            Session::get('userName') . ' (' . Session::get('userId') . ', ' . Session::get('userGroup') .
            ') changed shift type #' . $shiftType->id . ' from "' . $shiftType->title . '", start: ' . $shiftType->start . ', end: ' . $shiftType->end . ', weight: ' . $shiftType->statistical_weight . ' to "' . $newTitle . '" , start: ' . $newTimeStart . ', end: ' . $newTimeEnd . ', weight: ' . $newWeight . '. ');

        // Write and save changes
        $shiftType->title               = $newTitle;
        $shiftType->start          = $newTimeStart;
        $shiftType->end            = $newTimeEnd;
        $shiftType->statistical_weight  = $newWeight;
        $shiftType->save();

        // Return to the shiftType page
        Session::put('message', trans('mainLang.changesSaved'));
        Session::put('msgType', 'success');
        return Redirect::back();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        // Check credentials: you can only delete, if you have rights for marketing, section management or admin
        if(!Session::has('userId')
            OR (Session::get('userGroup') != 'marketing'
                AND Session::get('userGroup') != 'clubleitung'
                AND Session::get('userGroup') != 'admin'))
        {
            Session::put('message', trans('mainLang.cantTouchThis'));
            Session::put('msgType', 'danger');
            return Redirect::back();
        }

        // Get all the data
        // (throws a 404 error if shiftType doesn't exist)
        $shiftType = ShiftType::findOrFail($id);

        // Before deleting, check if this job type is in use in any existing schedule
        if (  Shift::where('shifttype_id', '=', $shiftType->id)->count() > 0  ) {
            // CASE 1: job type still in use - let the user decide what to do in each case

            // Inform the user about the redirect and go to detailed info about the job type selected
            Session::put('message', trans('mainLang.deleteFailedShiftTypeInUse'));
            Session::put('msgType', 'danger');
            return Redirect::action( 'ShiftTypeController@show', ['id' => $shiftType->id] );
        }
        else
        {
            // CASE 2: job type is not used anywhere and can be remove without side effects

            // Log the action while we still have the data
            Log::info('ShiftType deleted: ' .
                Session::get('userName') . ' (' . Session::get('userId') . ', ' . Session::get('userGroup') .
                ') deleted "' . $shiftType->title .  '" (it was not used in any schedule).');

            // Now delete the shiftType
            ShiftType::destroy($id);

            // Return to the management page
            Session::put('message', trans('mainLang.changesSaved'));
            Session::put('msgType', 'success');
            return Redirect::action( 'ShiftTypeController@index' );
        }
    }
}
