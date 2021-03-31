import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import firebase from '../firebaseConfig';
import { Button, ListGroup, ListGroupItem } from 'react-bootstrap';
import style from './PrDetals.module.css'

const PrDetals = (props) => {
    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState();
    const [productId, setProductId] = useState();
    const [editMode, setEditMode] = useState(true);
    const [coment, setComent] = useState('');




    useEffect(() => {
        setProductId(localStorage.getItem('detalsId'))
    })

    useEffect(() => {
        const docRef = firebase.firestore().collection("pr").doc(productId)
        docRef.get().then((doc) => {
            if (doc.exists) {
                console.log("Document data:", doc.data());
                setProduct(doc.data())
                setLoading(false)
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
        // docRef.onSnapshot((doc) => {
        //     console.log("Current data: ", doc.data());
        //     setProduct(doc.data())
        //     setLoading(false)
        // });
    }, [productId])

    const [prodName, setProdName] = useState('');
    const [prodCount, setProdCount] = useState('');
    const [prodHeight, setProdHeight] = useState('');
    const [prodWidth, setProdWidth] = useState('');
    const [prodWeight, setProdWeight] = useState('');
    const [prodDescription, setProdDescription] = useState('');

    const edit = () => {
        setProdName(product.name)
        setProdCount(product.count)
        setProdHeight(product.size.height)
        setProdWidth(product.size.width)
        setProdWeight(product.weight)
        setProdDescription(product.description)
        setEditMode(false)
    }

    const saveEdit = () => {
        const washingtonRef = firebase.firestore().collection("pr").doc(productId);
        washingtonRef.update({
            name: prodName,
            count: prodCount,
            size:{
                height: prodHeight,
                width: prodWidth,
            },
            weight: prodWeight,
            description: prodDescription,
        })
            .then(() => {
                console.log("Document successfully updated!");
            })
            .catch((error) => {
                console.error("Error updating document: ", error);
            });

        washingtonRef.get().then((doc) => {
            if (doc.exists) {
                console.log("Document data:", doc.data());
                setProduct(doc.data())
                setLoading(false)
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
        setEditMode(true)
    }

    const addComent = () => {
        console.log(coment)
        const washingtonRef = firebase.firestore().collection("pr").doc(productId)
        washingtonRef.update({
            comments: firebase.firestore.FieldValue.arrayUnion({ date: new Date(), description: coment })
        });
        setComent('')
        const docRef = firebase.firestore().collection("pr").doc(productId)
        docRef.get().then((doc) => {
            if (doc.exists) {
                console.log("Document data:", doc.data());
                setProduct(doc.data())
                setLoading(false)
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    }
    return (
        <div >
            {
                loading
                    ? <div>Loading ...</div>
                    : editMode
                        ? <div className={style.container}>
                            <img className={style.img} src={product.imageUrl ? product.imageUrl : null} />
                            <div className={style.detals}>
                                <h5> Властивості: </h5>
                                <p>name: {product.name}</p>
                                <p>кількість продуктів: {product.count}</p>
                                <p>height: {product.size.height}</p>
                                <p>width: {product.size.width}</p>
                                <p>вага: {product.weight} g</p>
                            </div>
                            <div className={style.description} >
                                <h5>Description:</h5>
                                <p>
                                    {product.description ? product.description : <p> опису немає</p>}
                                </p>
                            </div>
                        </div>
                        : <div className={style.container}>
                            <img className={style.img} src={product.imageUrl ? product.imageUrl : null} />
                            <div className={style.detals}>
                                <h5> Властивості: </h5>
                                <span>name: </span><input type='text' value={prodName} onChange={(e) => { setProdName(e.target.value) }} /><br />
                                <span>кількість продуктів: </span><input type='number' value={prodCount} onChange={(e) => { setProdCount(e.target.value) }} /><br />
                                <span>height: </span><input type='text' value={prodHeight} onChange={(e) => { setProdHeight(e.target.value) }} /><br />
                                <span>width: </span><input type='text' value={prodWidth} onChange={(e) => { setProdWidth(e.target.value) }} /><br />
                                <span>вага: </span><input type='text' value={prodWeight} onChange={(e) => { setProdWeight(e.target.value) }} />
                            </div>
                            <div className={style.description} >
                                <h5>Description:</h5>
                                <textarea value={prodDescription} onChange={(e) => { setProdDescription(e.target.value) }}> </textarea>
                            </div>
                        </div>
            }
            {
                editMode
                    ? <Button variant="warning" onClick={edit}>Edit</Button>
                    : <>
                        <Button variant="warning" onClick={saveEdit}>Save edit</Button>
                        <Button variant="secondary" onClick={() => { setEditMode(true) }}>Cancel</Button>
                    </>
            }
            <br />
            <NavLink className="ml-2" to={"/"} onClick={() => localStorage.removeItem('detalsId')}>Назад на головну</NavLink>
            <h5>Coments:</h5>
            <p>
                {
                    product
                        ? <div>
                            {product.comments.map(p => {
                                console.log(p)
                                return (
                                    <p>{p.description}</p>
                                )
                            }
                            )}
                        </div>
                        : <div>
                            loading...
                        </div>
                }
            </p>
            <h5>Add coments:</h5>
            <textarea onChange={(e) => { setComent(e.target.value) }} value={coment} /><br />
            <Button variant="primary" onClick={addComent}>Add coment</Button>
        </div>
    );
}

export default PrDetals