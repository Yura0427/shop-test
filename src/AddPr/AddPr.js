import React, { useState } from 'react';
import firebase from '../firebaseConfig';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal, } from 'react-bootstrap';
import { createUUID } from '../Shared/UUID';
import style from './AddPr.module.css'

const AddPr = (props) => {

    const [productImage, setProductImage] = useState('')
    const [progress, setProgress] = useState(0)
    const [productName, setProductName] = useState('')
    const [productCount, setProductCount] = useState()
    const [width, setWidth] = useState()
    const [height, setHeight] = useState()
    const [productWeight, setProductWeight] = useState('')
    const [productDescription, setproductDescription] = useState('')
  
  
    const upload = (e) => {
      const file = e.target.files[0]
      console.log('Upload works ');
      const filePath = `${createUUID()}.${file.type.split('/')[1]}`;
      const storageRef = firebase.storage().ref().child('productImage/' + filePath)
      const uploadTask = storageRef.put(file);
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress)
        }, (error) => {
          console.log('Upload error ', error);
        }, () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            console.log('File available at', downloadURL);
            setProductImage(downloadURL)
          });
        }
      );
    }
    const save = (e) => {
        e.preventDefault();
        firebase.firestore().collection("pr").add({
            count: +productCount,
            imageUrl: productImage,
            name: productName,
            size : {
                height,
                width
            },
            weight: productWeight,
            description: productDescription,
        })
            .then((docRef) => {
                setProductImage('')
                setProductName('')
                setProductCount('')
                setWidth('')
                setHeight('')
                setProductWeight('')
                setproductDescription('')
                console.log("Document written with ID: ", docRef.id);
                props.onHide()
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });

    }
  
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Add products
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            {
              productImage ? null : <div>File not uploaded</div>
            }
            <img src={productImage ? productImage : null} style={{ width: '100%' }} />
            <br />
            <progress value={progress} max="100" style={{ width: '100%' }} />
            <input type="file" accept=".png,.jpg" onChange={upload} className="btn btn-dark btn-lg btn-block" />
          </div>
          <span>назва :</span>
          <input type="text" onChange={(e)=>{setProductName(e.target.value)}} value={productName} placeholder='setProductName' />
          <span>кількість :</span>
          <input type="number" onChange={(e)=>{setProductCount(e.target.value)}} value={productCount} placeholder='setProductCount'/>
          <br/>
          <span>width: </span>
          <input type="number" onChange={(e)=>{setWidth(e.target.value)}} value={width} placeholder='setWidth'/>
          <span>height: </span>
          <input type="number" onChange={(e)=>{setHeight(e.target.value)}} value={height} placeholder='setHeight'/>
          <span>вага :</span>
          <input type="number" onChange={(e)=>{setProductWeight(e.target.value)}} value={productWeight} placeholder='setProductWeight'/>
          <p>description :</p>
          <textarea onChange={(e)=>{setproductDescription(e.target.value)}} value={productDescription} placeholder='опис продукту' style={{ width: '100%', margin: '.5px' }}/>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={save}>Save</Button>
          <Button onClick={props.onHide}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    );
  }
   export default AddPr