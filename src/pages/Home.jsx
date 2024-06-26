import { useEffect, useState } from "react"
import ContactComponent from "../components/ContactComponent"
import axios from 'axios';
import { useNavigate } from "react-router-dom";
const CLIENT_ADDRESS = import.meta.env.VITE_SERVER_ADDRESS;

const Home = () => {
    const [contacts, setContacts] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${CLIENT_ADDRESS}/api/v1/contactapp/contact/list`)
        .then(response => {
            setContacts(response.data.contacts);
        })
        .catch(err => { 
            console.error(err) 
        })
    }, []); 

    return (
        <div className="w-ful flex flex-col justify-center items-center">
            <div className="md:max-w-4xl w-11/12 flex flex-col justify-between py-8">
                <div className="flex w-full justify-between">
                    <h1 className="text-2xl">Welcome to your contacts</h1>
                    <button onClick={() => navigate('/add')} className="py-3 px-6 bg-black text-white rounded-lg text-base">Add New</button>
                </div>
                <div className="pt-10 flex flex-col justify-start items-start gap-4">
                    {!contacts && <p>No contacts yet</p>}
                    {contacts && contacts.map((contact, index) => (
                        <ContactComponent key={index} contact={contact}/>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Home