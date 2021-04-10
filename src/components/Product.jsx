import React, { useEffect, useState, useCallback } from "react"
import { useHistory, useParams } from "react-router-dom"
import { useDataInfo } from "../utils"

export const Product = ({ transactions, account, fetchUserInfo }) => {
	const history = useHistory()
	const { id: productId } = useParams()
	const { data: userInfo } = useDataInfo(fetchUserInfo, "/signUp")

	const [product, setProduct] = useState(null)
	const [seller, setSeller] = useState(null)

	useEffect(() => {
		;(async () => {
			try {
				const product = await transactions.methods.fetchProduct(productId).call()
				setProduct(product)
				const userInfo = await transactions.methods.fetchUserInfo().call({ from: product.seller })
				setSeller(userInfo)
			} catch (err) {
				history.replace("/")
			}
		})()
	}, [transactions, productId, history])

	console.log(product)
	console.log(seller)
	console.log(userInfo)

	const onProductToBuy = useCallback(() => {
		transactions.methods
			.buyProduct(productId)
			.send({
				from: account,
				value: window.web3.utils.toWei(product.price, "Ether"),
			})
			.on("receipt", receipt => {
				console.log(receipt)
				history.replace("/")
			})
			.on("error", error => {
				console.error(error.message)
			})
	}, [account, history, product, productId, transactions.methods])

	return (
		<div className='h-screen w-screen bg-blue-200 flex justify-center items-center'>
			<div className='bg-white w-full h-full md:w-1/2 shadow-2xl p-6 font-body'>
				<div className='bg-white text-center text-6xl font-bold font-body py-2 text-gray-700'>
					<span className='text-purple-400'>G</span>i<span className='text-blue-400'>G</span>e
					<span>!</span>
				</div>
				<div className='text-center'>
					<div>
						<div className='carousel w-2/3 m-auto relative shadow-2xl bg-white'>
							<div className='carousel-inner relative overflow-hidden w-full'>
								<input
									className='carousel-open'
									type='radio'
									id='carousel-1'
									name='carousel'
									aria-hidden='true'
									hidden='true'
									checked='checked'
								/>
								<div className='carousel-item absolute opacity-0'>
									<img
										className='w-full object-cover h-52'
										src={product?.imageUrl1}
										alt='product-img'
									/>
								</div>

								<input
									className='carousel-open'
									type='radio'
									id='carousel-2'
									name='carousel'
									aria-hidden='true'
									hidden='true'
									checked='checked'
								/>
								<div className='carousel-item absolute opacity-0'>
									<img
										className='w-full h-52 object-cover'
										src={product?.imageUrl2}
										alt='product-img'
									/>
								</div>

								<ol className='carousel-indicators'>
									<li className='inline-block mr-3'>
										<label
											for='carousel-1'
											className='carousel-bullet cursor-pointer block text-4xl text-white hover:text-blue-700'
										>
											•
										</label>
									</li>
									<li className='inline-block mr-3'>
										<label
											for='carousel-2'
											className='carousel-bullet cursor-pointer block text-4xl text-white hover:text-blue-700'
										>
											•
										</label>
									</li>
								</ol>
							</div>
						</div>
					</div>
					<div className='px-24'>
						<div className='text-3xl my-3 font-bold'>{product?.productName}</div>
						<hr />
						<div className='h-36 my-2'>{product?.description}</div>
						<hr />
						<div className='font-semibold'>{product?.location}</div>
						<div className='m-auto font-semibold my-2 w-20 h-10 rounded-full bg-purple-300 p-2'>
							ETH {product?.price}
						</div>
						<div>
							<button className='bg-blue-200 p-3 px-6' onClick={onProductToBuy}>
								Buy Product
							</button>
						</div>
						<div className='text-gray-400 text-xs mt-2'>Seller : {product?.seller}</div>
					</div>
				</div>
			</div>
		</div>
	)
}
