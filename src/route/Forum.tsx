/* eslint-disable react/no-unescaped-entities */
import { useRef, useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import PageTitleSmall from '../component/PageTitleSmall';
import './forum.scss';
import { IFlashcard, IQuestion } from '../utils/interface';
import QuestionBlock from '../component/QuestionBlock';
import ForumEditorBlock from '../component/ForumEditorBlock';
import {
  GET_FLASHCARD_FORUM,
  UPDATE_FLASHCARD_FORUM,
} from '../utils/graphqlRequest';
import { UserContext } from '../utils/UserContext';
import ErrorModal from '../component/ErrorModal';

export default function FlashcardForum() {
  const [isVisibleErrorModal, setIsVisibleErrorModal] =
    useState<boolean>(false);
  const { state } = useLocation<{ flashcardId: string; subjectId: string }>();
  const questionEditorRef = useRef<HTMLDivElement>(null);
  const { user } = useContext(UserContext);
  // =============================================================

  const { data } = useQuery<
    { getFlashcard: IFlashcard },
    { flashcardId: string; classroomId: string }
  >(GET_FLASHCARD_FORUM, {
    variables: {
      classroomId: user.classroom?.classroomId || '',
      flashcardId: state.flashcardId || '',
    },
    onError: () => {
      setIsVisibleErrorModal(true);
    },
  });

  const [flashcardMutation] = useMutation<{ updateForum: IFlashcard }>(
    UPDATE_FLASHCARD_FORUM,
    {
      variables: {
        classroomId: user.classroom?.classroomId || '',
        flashcardId: state.flashcardId || '',
        subjectId: state.subjectId || '',
        answer: null,
        question: null,
      },
    },
  );

  const handlePostQuestion = (text: string) => {
    flashcardMutation({
      variables: {
        question: { text },
      },
    });
  };

  const handlePostAnswer = (text: string, questionId: string) => {
    flashcardMutation({
      variables: {
        answer: {
          questionId,
          text,
        },
      },
    });
  };

  // =============================================================
  const takeMeToQuestionEditor = () => {
    const node = questionEditorRef.current;
    node?.scrollIntoView();
  };
  // ============================================
  return (
    <div className="forumPageContainer">
      <ErrorModal
        buttonText="Ok"
        isVisible={isVisibleErrorModal}
        onConfirmCallback={() => setIsVisibleErrorModal(false)}
        text="Une erreur s'est produite, merci de ressayer ultérieurement"
      />
      <PageTitleSmall textColor="#0998C0" title="Introduction à GraphQl" />
      <div className="forumHeadingContainer">
        <button
          className="writeAQuestionButton"
          type="button"
          onClick={() => takeMeToQuestionEditor()}
        >
          Ecrire une question
        </button>
      </div>
      {data?.getFlashcard.question.map((question: IQuestion) => {
        return (
          <QuestionBlock
            answer={question.answer}
            id={question.id}
            date={question.date}
            text={question.text}
            key={question.id}
            submitAnswerCallback={handlePostAnswer}
          />
        );
      })}
      <div className="forumEditorWrapper" ref={questionEditorRef}>
        <ForumEditorBlock
          placeHolderText="Ecrire ma question"
          onSubmitCallback={handlePostQuestion}
        />
      </div>
    </div>
  );
}
