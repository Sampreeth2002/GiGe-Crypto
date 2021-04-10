import React, { useEffect, useCallback } from "react"
import { Link } from "react-router-dom"
import { useAllProducts, useDataInfo } from "../utils"

export const Dashboard = ({ transactions, fetchUserInfo }) => {
	const { data: userInfo, error: userInfoError } = useDataInfo(fetchUserInfo)
	const [products, setProducts] = useAllProducts(
		transactions,
		useCallback(({ seller, owner }) => owner === seller, [])
	)

	useEffect(() => {
		transactions.events.ProductCreated({}).on("data", ({ returnValues }) => {
			setProducts(prevProducts => prevProducts.concat(returnValues))
		})
	}, [transactions.events, setProducts])

	useEffect(() => {
		transactions.events.ProductInfoUpdated({}).on("data", ({ returnValues }) => {
			setProducts(prevProducts =>
				prevProducts.map(product =>
					product.id === returnValues.id ? { ...product, ...returnValues } : product
				)
			)
		})
	}, [transactions.events, setProducts])

	useEffect(() => {
		transactions.events.ProductBought({}).on("data", ({ returnValues }) => {
			setProducts(prevProducts => prevProducts.filter(product => product.id !== returnValues.id))
		})
	}, [transactions.events, setProducts])

	console.log(products)
	console.log(userInfo)
	console.log(userInfoError)

	return (
		<div className='bg-gray-50'>
			<header>
				<div className='bg-white text-center text-6xl font-bold font-body py-8 text-gray-700'>
					<span className='text-purple-400'>G</span>i<span className='text-blue-400'>G</span>e
					<span>!</span>
				</div>
				<div className='text-center my-10 md:absolute md:right-10 md:top-12 md:my-0'>
					<Link
						className='font-bold font-body bg-purple-200 p-3 px-5 hover:bg-purple-300 m-3'
						to='/signUp'
					>
						Sign Up
					</Link>
				</div>
			</header>
			<div className='grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-24 py-10'>
				{products.map((product, index) => (
					<div key={index} className='w-72 shadow-lg m-4 font-body'>
						<img
							className='w-full h-36 object-cover'
							src={product.imageUrl1}
							alt={product.productName}
						/>
						<div className='p-7'>
							<div className='text-2xl font-bold text-center'>{product.productName}</div>
							<hr />
							<div className='mt-3 text-center mb-6'>
								<div className='my-2'>{product.description}</div>
								<hr />
								<div className='mt-2 font-semibold text-xs'>{product.location}</div>
								<div className='m-auto font-semibold my-2 w-20 h-10 rounded-full bg-purple-300 p-2'>
									{product.price} ETH
								</div>
							</div>
							<div className='text-center'>
								<Link
									className='bg-blue-200 p-3 px-5 hover:bg-blue-300'
									to={`/product/${product.id}`}
								>
									Checkout
								</Link>
							</div>
						</div>
					</div>
				))}
			</div>
			<footer className='text-gray-400 font-body text-center'>© 2021 Gige Team</footer>
		</div>
	)
}
