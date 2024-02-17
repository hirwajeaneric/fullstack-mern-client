import axios from "axios";
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import SuccessAlert from "../components/SuccessAlert";
import ErrorAlert from "../components/ErrorAlert";
const CLIENT_ADDRESS= import.meta.env.VITE_SERVER_ADDRESS;
export default function Create() {
  const navigate = useNavigate();

  const [message, setMessage] = useState({title: '', description: ''});
  const [error, setError] = useState({title: '', description: ''});
  const [contact, setContact] = useState({});
  const [picture, setPicture] = useState(null);

  // Function to update 
  const createContact = (e) => {
    e.preventDefault();

    setError({ title: '', description: '' });
    setMessage({ title: '', description: ''});

    axios.post(`${CLIENT_ADDRESS}/api/v1/contactapp/contact/add`, contact)
    .then(response => {
      if (response.status === 201) {
        setMessage({ title: 'Success', description: response.data.message});
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    })
    .catch(err => { 
      setError({ title: err.name, description: err.message});
    })
  }

  const handleInputs = (e) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  }
  
  const handlePictureSelection = (e) => {
    console.log(e.target.files[0]);
    setError({ title: '', description:''});

    if (e.target.files[0].size >= 1500000) {
      setError({
        title: "File too large",
        description: "Please select a file smaller than 2MB"
      });
    } else {
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = () => {
        console.log(reader.result); //base64encoded string 
        setPicture(reader.result);
        setContact({...contact, picture: reader.result});
      };
      reader.onerror = error => {
        setError({ title: 'Error', description: error });
      };
    }
  }

  return (
    <div className="w-ful flex flex-col justify-center items-center">
      <div className="md:max-w-4xl w-11/12 flex flex-col justify-between py-8">
        <h1 className="text-3xl mb-3 font-semibold">Add Contact</h1>
        <form onSubmit={createContact} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="fullName">Full name</label>
            <input 
              type="text" 
              name="fullName" 
              required
              value={contact.fullName || ''} 
              id="fullName" 
              onChange={handleInputs} 
              className="border-black border rounded-lg p-3"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              name="email" 
              required
              value={contact.email || ''} 
              id="email" 
              onChange={handleInputs} 
              className="border-black border rounded-lg p-3"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label htmlFor="phone">Phone</label>
            <input 
              type="number" 
              name="phone"
              minLength={10}
              maxLength={10}
              required 
              value={contact.phone || ''} 
              id="phone" 
              onChange={handleInputs} 
              className="border-black border rounded-lg p-3"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label htmlFor="picture">Picture</label>
            <input 
              type="file" 
              name="picture"
              accept="image/*"
              required  
              id="picture" 
              onChange={handlePictureSelection} 
              className="border-black border rounded-lg p-3"
            />
            {picture && <img width={100} height={100} src={picture} alt="Uploaded picture" />}
          </div>
          
          <button type="submit" className="mt-5 py-3 px-6 bg-slate-600 text-white rounded-lg text-base">Create</button>
          {message.description && <SuccessAlert message={message} />}
          {error.description && <ErrorAlert error={error} />}
        </form>
      </div>
    </div>
  )
}