import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";

function App() {
    const [count, setCount] = useState();

    const fetchCount = async () => {
        try {
            console.log("cououc");
            const response = await fetch("/api/count");
            console.log("resp:", response);
            const respjson = await response.json();
            console.log(respjson);
            if (response.ok) {
                const test = await response.json();
                console.log(test);
                setCount(await response.json());
            }
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        fetchCount();
    }, []);

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.js</code> and save to update and reload.
                </p>
                <p>Count: {count}</p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
        </div>
    );
}

export default App;
