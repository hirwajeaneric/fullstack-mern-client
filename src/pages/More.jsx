import axios from "axios";
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import SuccessAlert from "../components/SuccessAlert";
import ErrorAlert from "../components/ErrorAlert";
const CLIENT_ADDRESS = import.meta.env.VITE_SERVER_ADDRESS;

const More = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [message, setMessage] = useState({ title: '', description: '' });
  const [error, setError] = useState({ title: '', description: '' });
  const [contact, setContact] = useState({});

  useEffect(() => {
    axios.get(`${CLIENT_ADDRESS}/api/v1/contactapp/contact/findById?id=${params.contactId}`)
      .then(response => {
        setContact(response.data.contact);
      })
      .catch(err => {
        console.error(err);
        setError({ title: err.name, description: err.message });
      })
  }, [params.contactId])

  const deleteContact = (e) => {
    e.preventDefault();

    setError({ title: '', description: '' });
    setMessage({ title: '', description: '' });

    axios.delete(`${CLIENT_ADDRESS}/api/v1/contactapp/contact/delete?id=${params.contactId}`)
      .then(response => {
        if (response.status === 200) {
          setMessage({ title: 'Success', description: response.data.message });

          setTimeout(() => {
            navigate('/');
          }, 3000);
        }
      })
      .catch(err => {
        setError({ title: err.name, description: err.message });
        console.error(err);
      })
  };

  return (
    <div className="w-ful flex flex-col justify-center items-center">
      <div className="md:max-w-4xl w-11/12 flex flex-col justify-between py-8">
        {message.description && <SuccessAlert message={message} />}
        {error.description && <ErrorAlert error={error} />}
        <div className="flex w-full justify-between mt-5">
          <h1 className="text-3xl mb-3 font-semibold">{contact.fullName}</h1>
          <div className="flex gap-4">
            <button onClick={() => navigate(`/update/${contact._id}`)} className="py-3 px-6 bg-slate-600 text-white rounded-lg text-base">Update</button>
            <button type="button" onClick={deleteContact} className="py-3 px-6 bg-red-600 text-white rounded-lg text-base">Delete</button>
          </div>
        </div>
        <div>
          <p>Email: {contact.email}</p>
          <p>Phone: {contact.phone}</p>
          <p>Create on: {new Date(contact.createdAt).toUTCString()}</p>
          <p>Updated on: {new Date(contact.updatedAt).toUTCString()}</p>
        </div>
      </div>
    </div>
  )
}

export default More