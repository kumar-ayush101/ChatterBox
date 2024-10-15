import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const Login = () => {
    const navigate=useNavigate()
    const[formData,setFormData]=useState({
        username:'',
        password:'',
        
    })

    const handleChange=(e)=>{
        const {name,value}=e.target;
        setFormData({
            ...formData,
            [name]:value
        })
    }
  


    const handleSubmit= async (e)=>{
       e.preventDefault();
      

       try{
        const res=await axios.post(`${API_BASE_URL}/api/auth/login`,formData);
        console.log('Login Success')
        localStorage.setItem('token',res.data.token)    
        navigate('/home',{state:{userId:res.data.userId,username:res.data.username,image:res.data.image}})
       }catch(err){
        console.error(err);
        alert("wrong username or password");
       }
    }
  return (
    <div className="register-container">
        <form onSubmit={handleSubmit} className='register-form'>
            <h2>Login</h2>
            <div className="form-group">
                <label htmlFor="username">Username:</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                ></input>

            </div>
            <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                ></input>
                
            </div>
           
            <button type="submit"  className='register-button'>Login</button>
        </form>
     
    </div>
  )
}

export default Login





// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// // Access the API base URL from environment variables
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// const Login = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     username: '',
//     password: '',
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       // Use the environment variable for the API base URL
//       const res = await axios.post(`${API_BASE_URL}/api/auth/login`, formData);
//       console.log('Login Success');
//       localStorage.setItem('token', res.data.token);
//       navigate('/home', { state: { userId: res.data.userId, username: res.data.username, image: res.data.image } });
//     } catch (err) {
//       console.error(err);
//       alert('Wrong username or password');
//     }
//   };

//   return (
//     <div className="register-container">
//       <form onSubmit={handleSubmit} className="register-form">
//         <h2>Login</h2>
//         <div className="form-group">
//           <label htmlFor="username">Username:</label>
//           <input
//             type="text"
//             id="username"
//             name="username"
//             value={formData.username}
//             onChange={handleChange}
//             required
//           ></input>
//         </div>
//         <div className="form-group">
//           <label htmlFor="password">Password:</label>
//           <input
//             type="password"
//             id="password"
//             name="password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//           ></input>
//         </div>
//         <button type="submit" className="register-button">Login</button>
//       </form>
//     </div>
//   );
// };

// export default Login;
