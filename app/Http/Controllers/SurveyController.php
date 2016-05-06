<?php

namespace Lara\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Redirect;
//use Lara\Http\Requests;
use Lara\Survey;
use Lara\SurveyQuestion;
use DateTime;
use DateTimeZone;
use View;
use Input;

class SurveyController extends Controller
{
    public function index()
    {
        $surveys = Survey::all();
        foreach($surveys as $survey)
            $questions = $survey->getQuestions;
        return $questions;
    }
    public function create($year = null, $month = null, $day = null)
    {
        //dont creates surveys, just returns the createSurveyView with todays date
        // Filling missing date in case none is provided
        if ( is_null($year) ) {
            $year = date("Y");
        }

        if ( is_null($month) ) {
            $month = date("m");
        }

        if ( is_null($day) ) {
            $day = date("d");
        }

        // prepare correct date format to be used in the forms
        $date = strftime("%d-%m-%Y", strtotime($year.$month.$day));
        return View('createSurveyView', compact('date'));
    }

    /**
     * @param Request $input
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector
     */
    public function store(Request $input)
    {
        $survey = new Survey;
        $survey->prsn_id = 1;
        $survey->title = $input->title;
        $survey->description = $input->description;
        $survey->deadline = $input->deadline;
        $survey->save();

        foreach($input->questions as $number => $question){
            $question_db = new SurveyQuestion();
            $question_db->survey_id = $survey->id;
            $question_db->number = $number;
            $question_db->fieldType = 1; //example
            $question_db->content = $question;
            $question_db->save();
        }

        return Redirect::action('SurveyController@create');
    }


    public function destroy()
    {
        //;
    }

    public function show($id)
    {
        //find survey
        $survey = Survey::findOrFail($id);

        //find questions
        $questions = $survey->getQuestions;

        //maybe finds only answers for a single question? need to check this
        foreach($questions as $question)
            $answers = $question->getAnswers;

        return view('surveyView', compact('survey', 'questions', 'answers'));
    }

    public function update($id)
    {
        //find survey
        $survey = Survey::findOrFail($id);

        //find questions and answers
        $questions = Survey::findOrFail($survey->getQuestions->id);
        $answers = SurveyQuestion::findOrFail($questions->getAnswers->survey_question_number);

        //edit survey
        $survey = $this->editSurvey($id);

        //save everything
        $survey->save();

        /*
        foreach($questions as $question)
        {
            $question->save;
            foreach ($answers as $answer)
                $answer->save();
        }
        */
        return view('surveyView', compact('survey','questions','answers'));
    }

    public function edit($id)
    {
        //find survey
        $survey = Survey::findOrFail($id);

        //find questions and answers
        $questions = Survey::findOrFail($survey->getQuestions->id);
        $answers = SurveyQuestion::findOrFail($questions->getAnswers->survey_question_number);

        return view('editSurveyView', compact('survey','questions','answers'));
    }

    //private function, can only be called within the Controller
    private function editSurvey($id)
    {
        $survey = new Survey;

        //get existing survey by id if provided
        if (!is_null($id))
        {
            $survey = Survey::findOrFail($id);
        }

        //get deadline from Form
        $survey->deadline = Input::get('deadline');

        //update deadline
        if (!empty(Input::get('deadline')))
        {
            $newDeadline = new DateTime(Input::get('deadline'), mktime(0, 0, 0, 12, 31, 2100));
            $survey->deadline = $newDeadline->format('Y-m-d');
        }

        //if deadline is empty set new deadline, doesnt work at the moment
        else
        {
            $survey->deadline = date('Y-m-d', mktime(0, 0, 0, 12, 31, 2100));
        }
        return view('surveyView', compact($survey->id));
    }
}
