import express from "express";

const app = express();

app.listen(5001, () => {
	console.log("File upload server started on 5001");
});
