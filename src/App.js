import React, { useEffect, useState } from 'react';
import './App.css';
import firebase from './firebaseConfig';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Card, ListGroupItem, ListGroup, ButtonGroup, Modal } from 'react-bootstrap';
import AddPr from './AddPr/AddPr'
import PrDetals from './PrDetals/PrDetals';
import { Route, Switch } from 'react-router';
import { NavLink } from 'react-router-dom';

function App() {
  const [detalsId, setDetalsId] = useState('');

  return (

    <div >
      <Switch>
        <Route exact path='/' render={() => <Products setDetalsId={setDetalsId} />} />
        <Route path='/prDetals' render={() => <PrDetals detalsId={detalsId} />} />
      </Switch>

    </div>
  );
}

const Products = (props) => {
  const [delId, setDelId] = useState('');
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setDelId('')
    setShow(false)
  };
  const handleShow = (e) => {
    setDelId(e.target.name)
    setShow(true)
  };
  //
  const [modalShow, setModalShow] = useState(false);
  const [loading, setLoading] = useState(true);
  // get product end sort product
  const [products, setProducts] = useState([])
  const [sortTarget, setSortTarget] = useState(null)
  const [sortName, setSortName] = useState('Сортувати за...')

  const sortByCount = (e) => {
    setSortName(e.target.textContent)
    if (e.target.id === 'countUp') { setSortTarget("asc") }
    if (e.target.id === 'countDn') { setSortTarget("desc") }
  }
  const sortByName = (e) => {
    setSortName(e.target.textContent)
    if (e.target.id === 'name') { setSortTarget("name") }
  }

  useEffect(() => {
    setLoading(true)
    if ((sortTarget === 'asc') || (sortTarget === 'desc')) {
      return firebase.firestore().collection("pr")
        .orderBy("count", sortTarget)
        .onSnapshot((snapshot) => {
          const productsData = [];
          snapshot.forEach(doc => productsData.push({ ...doc.data(), id: doc.id }));
          setProducts(productsData)
          setLoading(false)
        })
    } else if (sortTarget === 'name') {
      return firebase.firestore().collection("pr")
        .orderBy("name", 'asc')
        .onSnapshot((snapshot) => {
          const productsData = [];
          snapshot.forEach(doc => productsData.push({ ...doc.data(), id: doc.id }));
          setProducts(productsData)
          setLoading(false)
        })
    } else {
      firebase.firestore().collection("pr")
        .onSnapshot((snapshot) => {
          const productsData = [];
          snapshot.forEach(doc => productsData.push({ ...doc.data(), id: doc.id }));
          setProducts(productsData)
          setLoading(false)
        })
    }
  }, [sortTarget])

  const del = (e) => {
    firebase.firestore().collection("pr").doc(`${delId}`).delete().then(() => {
      console.log("Document successfully deleted!");
    }).catch((error) => {
      console.error("Error removing document: ", error);
    });
    handleClose()
  }
  return (
    <div >
      <Button variant="primary" onClick={() => setModalShow(true)}>
        New protuct
      </Button>

      <AddPr
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
      <h5>Sort by : {sortName}</h5>
      <ButtonGroup aria-label="Basic example">
        <Button variant="secondary" onClick={sortByCount} id='countUp'>Від тих яких менше</Button>
        <Button variant="secondary" onClick={sortByCount} id='countDn'>Від тих яких більше</Button>
        <Button variant="secondary" onClick={sortByName} id='name'>Sort by name</Button>
      </ButtonGroup>
      <div className='bodyItems'>
        {
          !loading ? products.map(p => {
            return (
              <Card style={{ width: '33%', margin: '.5px' }}>
                <Card.Img variant="top" src={p.imageUrl ? p.imageUrl : null} />
                <ListGroup className="list-group-flush">
                  <ListGroupItem>name: {p.name}</ListGroupItem>
                  <ListGroupItem>кількість продуктів: {p.count}</ListGroupItem>
                  <ListGroupItem>height: {p.size.height}</ListGroupItem>
                  <ListGroupItem>width: {p.size.width}</ListGroupItem>
                  <ListGroupItem>вага: {p.weight} g</ListGroupItem>
                </ListGroup>
                <Card.Body>
                  <Card.Title>Description:</Card.Title>
                  <Card.Text>
                    {p.description ? p.description : <p> опису немає</p>}
                  </Card.Text>
                </Card.Body>
                <Card.Body>
                  <NavLink className="ml-2" to={"/prDetals"} onClick={() => {
                    props.setDetalsId(p.id);
                    localStorage.setItem('detalsId', p.id)
                  }}>детальніше про товар</NavLink>
                  {/* <input className="float-right btn btn-primary mt-1" onClick={del} name={p.id} type="button" value="Delete" /> */}
                  <>
                    <Button variant="primary" name={p.id} onClick={handleShow} className="float-right btn btn-danger mt-1">
                      Delete
                    </Button>

                    <Modal
                      show={show}
                      onHide={handleClose}
                      backdrop="static"
                      keyboard={false}
                    >
                      <Modal.Header closeButton>
                        <Modal.Title>Підтвердити видалення </Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        Ви дійсно бажаєте видалити цей товар?
                      </Modal.Body>
                      <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                          Відміна
                        </Button>
                        <Button variant="danger" onClick={del} name={p.id}>Видалити</Button>
                      </Modal.Footer>
                    </Modal>
                  </>
                </Card.Body>
              </Card>
            )
          }) : <div>loading</div>
        }
      </div>

    </div>
  );
}

export default App;


