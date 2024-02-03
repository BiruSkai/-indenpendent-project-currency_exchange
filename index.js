import express from "express";
import axios from "axios";

const app = express();
const port = 3000;
const url = "https://www.frankfurter.app/";

// Setting the path for static files
app.use(express.static("public"));
// Middleware for handling user input to backend
app.use(express.urlencoded({extended:true}));


app.get("/", (req, res) => {
        res.render("index.ejs", {data:"Type your exchange", amountOutput:"", amountInput:"", currencyInput:"", currencyOutput:""});
})

app.post("/checkExchange", async (req, res) => {
        // Taking user input in variable
        const {amountInput, currencyInput, currencyOutput} = req.body;
        try {
                // Data request to public API
                const response = await axios.get(url + "latest?" + `amount=${amountInput}&from=${currencyInput}&to=${currencyOutput}`);    
                console.log(response);    
                // Get dynamic key value
                const amountOutput = response.data.rates[currencyOutput.toUpperCase()];
                // Putting comma every last three digits
                function numberWithCommas(x) {
                        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    }
                // Sending data to corresponding ejs file
                return res.render("index.ejs", {data:response.data, amountOutput:numberWithCommas(amountOutput), amountInput, currencyInput, currencyOutput});
        } catch (error) {
                console.log("info*: ", error);
                return res.render("index.ejs", {error:"not found"});
        }
})

app.listen(port, () => {
        console.log("Server listening to port ", port)
})