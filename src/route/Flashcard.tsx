import { useState, useContext } from 'react';
import { useHistory, Link, useLocation } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import Switch from 'react-switch';
import {
  GET_FLASHCARD_BY_ID,
  UPDATE_FLASHCARD_STUDENT,
} from '../utils/graphqlRequest';
import Block from '../component/Block';
import bubbleMessage from '../assets/bubblemessage.svg';
import './Flashcard.scss';
import { IFlashcard } from '../utils/interface';
import { UserContext } from '../utils/UserContext';
import PageTitleSmall from '../component/PageTitleSmall';

export default function Flashcard() {
  const { state } = useLocation<{ flashcardId: string; subjectId: string }>();

  const history = useHistory();
  const [writingMode, setWritingMode] = useState(false);
  const { user } = useContext(UserContext);

  const { loading, data } = useQuery<
    { getFlashcard: IFlashcard },
    { flashcardId: string; classroomId: string }
  >(GET_FLASHCARD_BY_ID, {
    variables: {
      flashcardId: state.flashcardId || '',
      classroomId: user.classroom?.classroomId || '',
    },
    onError: () => {
      // voir comment on gere les erreurs ?
      history.goBack();
    },
    skip:
      user.classroom?.classroomId === undefined ||
      state.flashcardId === undefined,
  });

  const [flashcardMutation] = useMutation<{
    updateFlashcardParagraph: IFlashcard;
  }>(UPDATE_FLASHCARD_STUDENT, {
    variables: {
      classroomId: user.classroom?.classroomId || '',
      flashcardId: data?.getFlashcard?.id || '',
      subjectId: state.subjectId || '',
      subtitleId: '',
      paragraph: null,
      ressource: null,
    },
  });

  const handleChangeVisibility = (subtitleId: string, paragraphId: string) => {
    flashcardMutation({
      variables: {
        subtitleId,
        paragraph: {
          paragraphId,
          isPublic: true,
        },
      },
    });
  };

  const handleEditParagraph = (
    subtitleId: string,
    paragraphId: string | null,
    isPublic: boolean,
    text: string,
  ) => {
    flashcardMutation({
      variables: {
        subtitleId,
        paragraph: {
          paragraphId,
          isPublic,
          text,
        },
      },
    });
  };

  const handleEditRessource = (name: string, url: string) => {
    flashcardMutation({ variables: { ressource: { name, url } } });
  };

  const handleValidation = (subtitleId: string, paragraphId: string) => {
    flashcardMutation({
      variables: {
        subtitleId,
        paragraph: {
          paragraphId,
          isValidate: true,
        },
      },
    });
  };

  if (loading || !data) return <p>Loading...</p>;
  const flashcard = data.getFlashcard;
  return (
    <div className="flashcard">
      <div className="flashcard-header">
        <p className="flashcard-tags">
          {flashcard.tag?.map((tag) => (
            /*             <Link to={`/forums?tag=${tag}`} key={tag}>
              <span>{`#${tag}`}</span>
            </Link> */
            <Link to={`/forums/${tag}`} key={tag}>
              <span>{`#${tag}`}</span>
            </Link>
          ))}
        </p>
        <PageTitleSmall title={flashcard.title} textColor="#FCC300" />
        <div className="flashcard-header-action">
          {!user.isTeacher && (
            <>
              <Switch
                onColor="#FCC300"
                offColor="#000000"
                uncheckedIcon={false}
                checkedIcon={false}
                onChange={() => setWritingMode((prev) => !prev)}
                checked={writingMode}
                width={32}
                height={20}
              />
              <span>{writingMode ? 'Ecriture' : 'Lecture'}</span>
            </>
          )}
          <button
            className="btn"
            type="button"
            onClick={() => history.push('/forums')}
          >
            <img src={bubbleMessage} alt="Accéder au forum" />
          </button>
        </div>
      </div>

      {/* sur les subtitles, ressources 
        title
        contenu
        showLock
      */}
      {flashcard.subtitle?.map((subtitle) => (
        <Block
          edit={writingMode}
          title={subtitle.title}
          paragraph={subtitle.paragraph}
          key={subtitle.title}
          position={subtitle.position}
          actionVisibility={handleChangeVisibility}
          actionValidation={handleValidation}
          subtitleId={subtitle.id}
          handleEdit={handleEditParagraph}
        />
      ))}
      <Block
        title="Ressources"
        ressource={flashcard.ressource}
        edit={writingMode}
        handleEditRessource={handleEditRessource}
      />
    </div>
  );
}
