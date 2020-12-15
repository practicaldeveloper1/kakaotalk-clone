import React from 'react'
import './Login.css'
import { Button } from '@material-ui/core'
import { auth, provider } from "./firebase";
import { actionTypes } from './reducer';
import { useStateValue } from './StateProvider';

function Login() {

    const [{ }, dispatch] = useStateValue();

    const signIn = async () => {
        try {
            const result = await auth.signInWithPopup(provider)
            dispatch({
                type: actionTypes.SET_USER,
                user: result.user
            });
        }
        catch (error) {
            alert(error.message);
        }

    }


    return (
        <div className='login'>
            <img src="https://www.flaticon.com/svg/static/icons/svg/2111/2111466.svg"
                alt=""
            />
            <div className="login__text">
                <h1>Sign in to Kakao Talk made by Practical Dev</h1>
            </div>

            <Button onClick={signIn} >
                Sign In With Google
          </Button>

        </div>
    )
}

export default Login
