import React, { useContext, useState, useEffect, useRef } from 'react'
import {  Redirect } from 'react-router-dom';
import { UserContext } from '../../providers/UserProvider';
import { db, logOut } from '../../services/firebase';
import Loading from '../../widgets/Loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faUserPlus, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import EmptyIlustration from './../../assets/empty.png';
import './Home.css';
import crypto from 'crypto-js';
import { decrypt, encrypt } from '../../utils/encrypt';

const MySwal = withReactContent(Swal);

function Home() {
    const [userState, afterFetch] = useContext(UserContext);
    const [redirectState, setredirectState] = useState(null);
    const [isToolsOpen, setIsToolsOpen] = useState(false);
    const [contactState, setContactState] = useState(null);
    const [modalAddState, setModalAddState] = useState(false);

    // state for input
    const [inputNameState, setInputNameState] = useState('');
    const [inputNumberState, setInputNumberState] = useState('');
    const [inputStarterState, setInputStarterState] = useState('');

    const wrapperRef = useRef(null);

    useEffect(() => {
        if(!userState && afterFetch){
            setredirectState('/login');
        }else if(userState && afterFetch){
            db.collection('app')
            .doc('contacts')
            .collection(userState.email)
            .onSnapshot(snapshot => {
                const resultFromFirestore = snapshot.docs;
                
                setContactState(resultFromFirestore.map(result => (
                    {   
                        nameContact : result.data().name, 
                        numberContact: decrypt(result.data().number).toString(crypto.enc.Utf8), 
                        starter: result.data().starter,
                        id: result.id
                    }
                )));
            });
        }
    }, [userState, afterFetch]);


    const handleLogout = () => {
        logOut();
        window.location.reload();
    }

    const handleClickBody = (event) => {
        if (!wrapperRef.current.contains(event.target)) {
            setIsToolsOpen(false);
        }
    }


    const handleAddNumber = async () => {
        // validate
        if(!inputNameState.trim() || !inputNumberState.trim()){
            if(!inputNameState.trim()){
                await MySwal.fire({ icon: 'error', title: 'Nama tidak boleh kosong' });
            }
    
            if(!inputNumberState.trim()){
                await MySwal.fire({ icon: 'error', title: 'Nomer tidak boleh kosong' });
            }
        }else{
            if(inputNumberState.length <= 10 || inputNumberState.substring(0,3) !== '+62'){
                if(inputNumberState.length <= 10){
                    await MySwal.fire({ icon: 'error', title: 'Nomer kurang dari 9 digit!!' });
                }

                if(inputNumberState.substring(0,3) !== '+62'){
                    await MySwal.fire({ icon: 'error', title: 'Nomer harus diawali dengan kode +62!!' });
                }

                return;
            }

            pushToFirestore();
        }
        
    }

    const pushToFirestore =  () => {
        db.collection('app')
            .doc('contacts')
            .collection(userState.email)
            .add({
                name: inputNameState,
                number: encrypt(inputNumberState.slice(1)).toString(),
                starter: inputStarterState
            })
            .then(async () => {
                setModalAddState(false);
                setInputNameState('');
                setInputNumberState('');
                setInputStarterState('');

                await MySwal.fire({ title: 'Success' });
            })
            .catch( async (error) => {
                await MySwal.fire({ icon: 'error', title: `Gagal menambahkan karena ${error}`});
            });
    }

    const goToWhatsapp = (number, starter) => {
        window.open(
            `https://wa.me/${number}?text=${starter}`,
            '_blank' // <- This is what makes it open in a new window.
          );
    }
  
    if(afterFetch){
        if(redirectState){
            return (<Redirect to={redirectState} />)
        }else{
            return (
                <div onClick={handleClickBody} >
                    {modalAddState &&  
                        <div id="inputModal" className="modal">
                            <div className="modal-content">
                                <span className="close" onClick={() => setModalAddState(false)}>&times;</span>
                                <h1>Add Contact</h1>
                                <input type="text"  placeholder="Masukkan nama..." onChange={(event) => setInputNameState(event.target.value)} value={inputNameState}/>
                                <input type="tel" pattern="[0-9]" placeholder="Masukka nomer diawali +62" onChange={(event) => setInputNumberState(event.target.value)} value={inputNumberState}/>
                                <textarea  rows="5" placeholder="Template pesan (opsional)" onChange={(event) => setInputStarterState(event.target.value)} value={inputStarterState}></textarea>
                                <div className="modal-action" >
                                    <button className="cancel" onClick={() => setModalAddState(false)}>Batalkan</button>
                                    <button className="add" onClick={handleAddNumber}>Tambahkan</button>
                                </div>
                            </div>
                        </div>
                    }
                   
                    <nav>
                        <h1 className="logo">WWS</h1>
                        <div className="nav-right">
                            {userState ? 
                            <>
                                <img onClick={() => setIsToolsOpen(!isToolsOpen)} src={userState.photoURL} alt={userState.displayName} ref={wrapperRef}/>
                                {isToolsOpen && (
                                    <div className="nav-right_tooltip">
                                        <p>Welcome back, {userState.displayName}</p>
                                        <hr/>
                                        <p className="logout" onClick={handleLogout}>Logout</p>
                                    </div>
                                )
                                }
                                
                            </>
                            : 
                            <></>}
                        </div>
                    </nav>
                    <main>
                        <div className="floating-add" onClick={() => setModalAddState(true)} >
                            <FontAwesomeIcon icon={faUserPlus} />
                        </div>
                        <h1>Contact Available</h1>
                        {
                            contactState  ?
                                 contactState.length > 0 ?
                                    contactState.map(contact => (
                                        <div className="contacts" key={contact.id} >
                                            <div className="wrapper-top">
                                                <div className="contacts-left">
                                                    <h2 className="name">{contact.nameContact} <FontAwesomeIcon icon={faTrash} /></h2>
                                                    <h3>+{contact.numberContact}</h3>                                                
                                                </div>
                                                <div className="contacts-right" onClick={() => goToWhatsapp(contact.numberContact, contact.starter ? contact.starter : '')}>
                                                    Chat <FontAwesomeIcon icon={faArrowRight} />
                                                </div>
                                            </div>
                                            <p><span className="prefix-starter">Starter Message : </span>{contact.starter ? `${contact.starter}...` : '-'}</p>     
                                        </div>
                                    )) : 
                                    <div style={{textAlign: 'center'}}>
                                        <img className='empty-ilustrations' src={EmptyIlustration} alt="empty"/>
                                        <h3>You don't have any contact available</h3>
                                    </div>
                            : <></>

                        }
                    </main>
                </div>
            )
        }
    }else{
        return (
            <Loading/>
           )
    }
}

export default Home;
