import React , { useState } from 'react'
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Login = () => {
    
    const {setShowUserLogin, setUser, axios, navigate} = useAppContext()
    // State to manage the current state of the form (login or register)
    // It is used to toggle between login and registration forms
    const [state, setState] = useState("login");

    // State to manage the input fields for name, email, and password
    // These states are used to capture user input for registration or login
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onSubmitHandler = async (event)=>{
        try {
            // Prevent the default form submission behavior
            // This is important to prevent the page from reloading when the form is submitted
            event.preventDefault();

            // If the state is "login", we send a POST request to the login endpoint
            // If the state is "register", we send a POST request to the register endpoint
            const {data} = await axios.post(`/api/user/${state}`,{
                name, email, password
            });
            // If the request is successful, we navigate to the home page and update the user state
            // We also close the login modal by setting showUserLogin to false
            if (data.success){
                
                navigate('/')
                // setUser is used to update the user state 
                setUser(data.user)
                setShowUserLogin(false)
            }else{
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

  return (
    // clicking outside the form , and inside this div will close the login model.
    <div onClick={()=> setShowUserLogin(false)} className='fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center text-sm text-gray-600 bg-black/50'>

        {/* We use e.stopPropagation ,This prevents the click event from "bubbling up" to parent components.*/}
        {/* If the form is inside a modal or overlay, and clicking outside the form is supposed to close the modal, you don’t want clicks inside the form to also trigger that closing logic. So, you stop the event from propagating upward. */}
        <form onSubmit={onSubmitHandler} onClick={(e)=>e.stopPropagation()} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white">
            <p className="text-2xl font-medium m-auto">
                <span className="text-primary">User</span> {state === "login" ? "Login" : "Sign Up"}
            </p>

            {/* If the user is just registering , then show the Name input filed. */}
            {state === "register" && (
                <div className="w-full">
                    <p>Name</p>
                    <input onChange={(e) => setName(e.target.value)} value={name} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="text" required />
                </div>
            )}

            <div className="w-full ">
                <p>Email</p>
                <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="email" required />
            </div>
            <div className="w-full ">
                <p>Password</p>
                <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="password" required />
            </div>

            {/* This section contains a link to switch between login and registration forms */}
            {/* It allows users to toggle between the two states (Login and Register) */}
            {state === "register" ? (
                <p>
                    Already have account? <span onClick={() => setState("login")} className="text-primary cursor-pointer">click here</span>
                </p>
            ) : (
                <p>
                    Create an account? <span onClick={() => setState("register")} className="text-primary cursor-pointer">click here</span>
                </p>
            )}

            <button className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer">
                {state === "register" ? "Create Account" : "Login"}
            </button>
        </form>
    </div>
  )
}

export default Login
