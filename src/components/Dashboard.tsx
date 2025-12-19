function Dashboard() {
    return <h1>Hello {localStorage.getItem("token")}, you're logged in!</h1>
}

export default Dashboard;