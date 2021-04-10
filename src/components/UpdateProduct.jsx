import React, { useEffect, useRef, useState } from "react"
import { useParams, useHistory } from "react-router-dom"
import { useDataInfo } from "../utils"

export const UpdateProduct = ({ transactions, account, fetchUserInfo }) => {
	const history = useHistory()
	const { data: userInfo } = useDataInfo(fetchUserInfo, "/signUp")
	const { id: productId } = useParams()

	const [product, setProduct] = useState(null)

	useEffect(() => {
		;(async () => {
			try {
				const product = await transactions.methods.fetchProduct(productId).call()
				setProduct(product)
			} catch (err) {
				console.error(err)
			}
		})()
	}, [transactions, productId, history])

	const productNameRef = useRef()
	const imageUrl1Ref = useRef()
	const imageUrl2Ref = useRef()
	const descriptionRef = useRef()
	const locatipnRef = useRef()
	const priceRef = useRef()

	console.log(userInfo)

	return (
		<form
			onSubmit={event => {
				event.preventDefault()
				transactions.methods
					.updateProductInfo(
						productId,
						productNameRef.current.value,
						imageUrl1Ref.current.value,
						imageUrl2Ref.current.value,
						descriptionRef.current.value,
						locatipnRef.current.value,
						Number(priceRef.current.value)
					)
					.send({ from: account })
					.on("receipt", receipt => {
						console.log(receipt)
					})
					.on("error", error => {
						console.error(error)
					})
			}}
		>
			<input
				type='text'
				placeholder='Product Name'
				ref={productNameRef}
				defaultValue={product?.productName}
				disabled={product === null}
			/>
			<input
				type='text'
				placeholder='Image URL 1'
				ref={imageUrl1Ref}
				defaultValue={product?.imageUrl1}
				disabled={product === null}
			/>
			<input
				type='text'
				placeholder='Image URL 2'
				ref={imageUrl2Ref}
				defaultValue={product?.imageUrl2}
				disabled={product === null}
			/>
			<input
				type='text'
				placeholder='Description of Product'
				ref={descriptionRef}
				defaultValue={product?.description}
				disabled={product === null}
			/>
			<input
				type='text'
				placeholder='Location'
				ref={locatipnRef}
				defaultValue={product?.location}
				disabled={product === null}
			/>
			<input
				type='number'
				placeholder='Price'
				ref={priceRef}
				defaultValue={product?.price}
				disabled={product === null}
			/>
			<input type='submit' />
		</form>
	)
}
