import { Switch, Route } from 'react-router-dom';
import './App.scss';
import { useContext } from 'react';
import Header from './component/Header';
import Body from './component/Body';
import Home from './route/Home';
import Forums from './route/Forums';
import Study from './route/Study';
import Flashcard from './route/Flashcard';
import File from './route/File';
import MyClassroom from './route/MyClassroom';
import Footer from './component/Footer';
import { UserContext } from './utils/UserContext';
import ProfessorAccount from './route/ProfessorAccount';
import AddStudent from './route/AddStudent';
import Connect from './route/Connect';
import AddPromotion from './route/addPromotion';
import Flashcards from './route/FlashCards';
import Forum from './route/Forum';

function App() {
  const { addUser, removeUser } = useContext(UserContext);

  return (
    <div className="App">
      <Header />
      <Body>
        <Switch>
          <Route path="/mes-fiches-de-revisions" component={File} />
          <Route
            path="/nous-contacter"
            render={() => <h2>Nous contacter</h2>}
          />
          <Route path="/notre-équipe" render={() => <h2>Notre équipe</h2>} />
          <Route
            path="/mentions-legales"
            render={() => <h2>Mentions légales</h2>}
          />
          <Route exact path="/mes-matières">
            <Study />
          </Route>
          <Route exact path="/mes-matières/:matiere">
            <Flashcards />
          </Route>
          <Route
            exact
            path="/mes-matières/:matiere/:flashcardSlug"
            component={Flashcard}
          />
          <Route exact path="/forums/:tag?" component={Forums} />
          <Route exact path="/forum/:flashcardSlug" component={Forum} />
          <Route
            path="/me-connecter"
            render={() => <Connect setUser={addUser} />}
          />
          <Route path="/ma-promotion" component={MyClassroom} />
          <Route path="/ajouter-un-élève" component={AddStudent} />
          <Route
            path="/ajouter-une-fiche"
            render={() => <h2>Ajouter une fiche</h2>}
          />
          <Route
            path="/me-deconnecter"
            render={() => {
              localStorage.removeItem('wikitoken');
              removeUser();
              return <h2>Déconnection en cours</h2>;
            }}
          />
          <Route path="/rechercher" render={() => <h2>Rechercher</h2>} />
          <Route path="/mon-espace" component={ProfessorAccount} />
          <Route path="/ajouter-une-promotion" component={AddPromotion} />
          <Route exact path="/" component={Home} />
        </Switch>
      </Body>
      <Footer />
    </div>
  );
}

export default App;
