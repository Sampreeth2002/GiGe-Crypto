import React, { useEffect, useState, useCallback } from "react"
import { BrowserRouter, Route } from "react-router-dom"
import Web3 from "web3"
import Transaction from "../abis/Transactions.json"
import { Dashboard } from "./Dashboard"
import { Profile } from "./Profile"
import { Product } from "./Product"
import { SellProduct } from "./SellProduct"
import { UpdateProduct } from "./UpdateProduct"
import { SignUp } from "./SignUp"

export const App = () => {
	const [account, setAccount] = useState(null)
	const [transactions, setTransactions] = useState(null)

	useEffect(() => {
		;(async () => {
			if (window.ethereum) {
				window.web3 = new Web3(window.ethereum)
				await window.ethereum.enable()
			} else if (window.web3) {
				window.web3 = new Web3(window.web3.currentProvider)
			} else {
				window.alert("Non-Ethereum browser detected. You should consider trying MetaMask!")
			}

			const web3 = window.web3
			const accounts = await web3.eth.getAccounts()
			setAccount(accounts[0])
			const networkId = await web3.eth.net.getId()
			const networkData = Transaction.networks[networkId]
			if (networkData) {
				setTransactions(new web3.eth.Contract(Transaction.abi, networkData.address))
			} else {
				window.alert("Transaction contract not deployed to detected network.")
			}
		})()
	}, [])

	const fetchUserInfo = useCallback(
		() => transactions.methods.fetchUserInfo().call({ from: account }),
		[transactions, account]
	)

	return transactions === null ? (
		<div>Loading</div>
	) : (
		<BrowserRouter>
			<Route
				path='/'
				exact
				render={() => (
					<Dashboard transactions={transactions} account={account} fetchUserInfo={fetchUserInfo} />
				)}
			/>
			<Route
				path='/profile'
				exact
				render={() => (
					<Profile transactions={transactions} account={account} fetchUserInfo={fetchUserInfo} />
				)}
			/>
			<Route
				path='/sell'
				exact
				render={() => (
					<SellProduct
						transactions={transactions}
						account={account}
						fetchUserInfo={fetchUserInfo}
					/>
				)}
			/>
			<Route
				path='/update/product/:id'
				exact
				render={() => (
					<UpdateProduct
						transactions={transactions}
						account={account}
						fetchUserInfo={fetchUserInfo}
					/>
				)}
			/>
			<Route
				path='/product/:id'
				exact
				render={() => (
					<Product transactions={transactions} account={account} fetchUserInfo={fetchUserInfo} />
				)}
			/>
			<Route
				path='/signUp'
				exact
				render={() => (
					<SignUp transactions={transactions} account={account} fetchUserInfo={fetchUserInfo} />
				)}
			/>
		</BrowserRouter>
	)
}
