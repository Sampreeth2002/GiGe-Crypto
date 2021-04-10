import React, { useRef } from "react"
import { useHistory } from "react-router-dom"

export const SignUp = ({ transactions, account }) => {
	const history = useHistory()

	const nameRef = useRef()
	const emailRef = useRef()
	const phoneRef = useRef()

	const onSignUp = event => {
		event.preventDefault()
		transactions.methods
			.signUp(nameRef.current.value, emailRef.current.value, phoneRef.current.value)
			.send({ from: account })
			.on("receipt", receipt => {
				console.log(receipt)
				history.replace("/")
			})
			.on("error", error => {
				console.error(error)
			})
	}

	return (
		<div className='w-screen h-screen flex place-items-center flex-col'>
			<div className='bg-white text-center text-6xl font-bold font-body py-8 text-gray-700'>
				<span className='text-purple-400'>G</span>i<span className='text-blue-400'>G</span>e
				<span>!</span>
			</div>

			<form className='w-2/3 h-2/3 md:w-1/2 md:h-2/3 shadow-2xl p-16 font-body' onSubmit={onSignUp}>
				<div className='text-2xl text-center'>Sign Up</div>
				<input className='input' autocomplete='off' type='text' ref={nameRef} placeholder='Name' />
				<input
					className='input'
					autocomplete='off'
					type='text'
					ref={emailRef}
					placeholder='Email'
				/>
				<input
					className='input'
					autocomplete='off'
					type='text'
					ref={phoneRef}
					placeholder='Phone'
				/>
				<div className='text-center mt-10'>
					<button className='w-48 h-12 bg-purple-300 focus:outline-none'>Submit</button>
				</div>
			</form>
		</div>
	)
}
