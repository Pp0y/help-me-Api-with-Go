import {useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Navbar from './Navbar';

function Profile() {
  const [isLoaded, setIsLoaded] = useState(true);
  const [user, setUser] = useState([]);
  const MySwal = withReactContent(Swal)


  useEffect(() => {
    const navigate = useNavigate
    const token = localStorage.getItem('token')
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    
    var requestOptions = {
      method: 'GET', 
      headers: myHeaders,
      redirect: 'follow'
    };
    
    fetch("http://localhost:8080/users/profile", requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.status === 'ok'){
            setUser(result.user)
            setIsLoaded(false)
        } else if (result.status === 'forbidden'){
            MySwal.fire({
                html: <i>{result.message}</i>,
                icon: 'error'
            }).then ((value) => {
                 navigate('/login')
            })
        }
        console.log(result)
    })
      .catch(error => console.log('error', error));
  }, [])

  if (isLoaded) return (<div>Loading</div>)
    else{
        return (
            <div>
              <Navbar/>
               {user.username}
            </div>
        )
    }
}

export default Profile