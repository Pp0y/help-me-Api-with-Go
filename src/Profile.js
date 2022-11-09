import {useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';


function Profile() {
  const [isLoaded, setIsLoaded] = useState(true);
  const [user, setUser] = useState([]);
  const MySwal = withReactContent(Swal)
  const navigate = useNavigate()
  console.log(user)

  useEffect(() => {
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
const logout = () =>{
  localStorage.removeItem('token')
  navigate('/login')
}


  if (isLoaded) return (<div>Loading</div>)
    else{
        return (
            <div>
              <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                 <Toolbar>
                   <IconButton
                     size="large"
                     edge="start"
                     color="inherit"
                     aria-label="menu"
                     sx={{ mr: 2 }}
                   >
                     <MenuIcon />
                     </IconButton>
                 <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    ระบบยืมกุญแจ
                 </Typography>
                 <Button onClick ={logout} color="inherit">Logout</Button>
                  </Toolbar>
                </AppBar>
               </Box>
              <div>{user[0].Id}</div>
               <div>{user[0].Username}</div>
               <div>{user[0].Fullname}</div>
               <img src ={user[0].Avatar} alt={user[0].Id} width={100}/>
            </div>
        )
    }
}

export default Profile