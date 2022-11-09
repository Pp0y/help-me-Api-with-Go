import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Navbar from './Navbar';

function Login() {
    const navigate = useNavigate()
    const MySwal = withReactContent(Swal)
    const [inputs, setInputs] = useState({});

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}))
      }
    
      const handleSubmit = (event) => {
        event.preventDefault();

            var myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");

                var raw = JSON.stringify({
                "username": inputs.username,
                "password": inputs.password,
                });

                var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
                };

                fetch("http://localhost:8080/login", requestOptions)
                .then(response => response.json())
                .then(result => {
                    console.log(result)
                    if (result.status === 'ok'){
                        MySwal.fire({
                            html: <i>{result.message}</i>,
                            icon: 'success'
                          }).then((value) => {
                            localStorage.setItem('token', result.token)
                            navigate('/profile')
                          })
                    }else {
                        MySwal.fire({
                            html: <i>{result.message}</i>,
                            icon: 'error'
                          })
                    }
                })
                .catch(error => console.log('error', error));
        console.log(inputs);
      }

  return (
    <div>
      <Navbar/>
     <form onSubmit={handleSubmit}>
        <label>Username:
        <input 
            type="text" 
            name="username" 
            value={inputs.username || ""} 
            onChange={handleChange}
        />
        </label>
        <label>Password:
            <input 
            type="password" 
            name="password" 
            value={inputs.password || ""} 
            onChange={handleChange}
            />
            </label>
            <input type="submit" />
        </form>
    </div>
  )
}

export default Login