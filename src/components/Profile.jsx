import Identicon from "identicon.js"
import React, { useCallback, useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAllProducts, useDataInfo } from "../utils"

export const Profile = ({ transactions, account, fetchUserInfo }) => {
	const { data: userInfo } = useDataInfo(fetchUserInfo, "/signUp")
	const [products] = useAllProducts(
		transactions,
		useCallback(({ owner }) => owner === account, [account])
	)

	const [boughtProducts, setBoughtProducts] = useState([])
	const [sellingProducts, setSellingProducts] = useState([])

	useEffect(() => {
		setBoughtProducts(products.filter(({ seller, owner }) => seller !== owner))
		setSellingProducts(products.filter(({ seller, owner }) => seller === owner))
	}, [products])

	useEffect(() => {
		transactions.events.ProductCreated({}).on("data", ({ returnValues }) => {
			if (returnValues.id === account)
				setSellingProducts(prevProducts => prevProducts.concat(returnValues))
		})
	}, [account, transactions.events, setSellingProducts])

	useEffect(() => {
		transactions.events.ProductInfoUpdated({}).on("data", ({ returnValues }) => {
			setSellingProducts(prevProducts =>
				prevProducts.map(product =>
					product.id === returnValues.id ? { ...product, ...returnValues } : product
				)
			)
		})
	}, [transactions.events, setSellingProducts])

	useEffect(() => {
		transactions.events.ProductBought({}).on("data", ({ returnValues }) => {
			setSellingProducts(prevProducts =>
				prevProducts.filter(product => product.id !== returnValues.id)
			)
			if (returnValues.id === account)
				setBoughtProducts(prevProducts => prevProducts.concat(returnValues))
		})
	}, [account, transactions.events, setBoughtProducts, setSellingProducts])

	console.log(products)
	console.log(userInfo)
	console.log(boughtProducts)
	console.log(sellingProducts)

	return (
		<div>
			<header>
				<div className='bg-white text-center text-6xl font-bold font-body py-8 text-gray-700'>
					<span className='text-purple-400'>G</span>i<span className='text-blue-400'>G</span>e
					<span>!</span>
				</div>
				<div className='text-center my-10 md:absolute md:right-10 md:top-6 md:my-0 flex items-center md:justify-items-center'>
					<Link className='font-semibold text-xs text-gray-500 font-body p-3 px-5 m-3' to='/'>
						{account}
					</Link>
					<Link to='/'>
						<img
							className='w-12 h-12 rounded-full '
							src={`data:image/png;base64,${new Identicon(account, 420).toString()}`}
							alt='userIcon'
						/>
					</Link>
				</div>
			</header>
			<h1 className='font-bold text-3xl md:text-4xl text-center font-body pb-5 text-gray-700 bg-purple-50 py-10'>
				Here's your Order History! 🛒
			</h1>
			<div className='grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-24 py-10 bg-blue-50'>
				{products.map((product, index) => (
					<div key={index} className='w-72 shadow-lg m-4 font-body bg-white'>
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
									ETH {product.price}
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
		</div>
	)
}
