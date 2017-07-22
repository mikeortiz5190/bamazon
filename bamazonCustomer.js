var mysql = require('mysql');

var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user:"root",
    password:"root",
    database:"bamazon"
});



connection.connect(function(err){
    console.log("connected as id " + connection.threadId)
});

function show(){
    connection.query("SELECT * FROM products", function(err,res){
        console.log(res);
        inquirer.prompt({
            name:"products",
            type:"rawlist",
            choices: function(value){
                var productsArray = [];
                for (var i = 0; i < res.length; i++){
                    productsArray.push(res[i].itemname);
                }
                return productsArray;
            },
            message:"Please input the item ID of the item you wish to purchase"
        }).then(function(answer){
            for(var i = 0; i < res.length; i++){
                if(res[i].itemname === answer.choice){
                    var chosenItem = res[i];
                    inquirer.prompt({
                        name:"quantity",
                        type:"input",
                        message:"how many units of this product do you want?"
                    }).then(function(answer){
                        connection.query(
                            "UPDATE products SET? WHERE ?",[{
                                stock_quantity: stock_quantity - answer.quantity
                            }], function(err,res){
                                console.log("item successfully purchased");
                                console.log("New quantity is now: " + stock_quantity);
                            }
                            
                        )
                    })
                }
            }
        })

    });
};

show();
/*
function start(){
    inquirer.prompt({
        name:"askForId",
        type:"input",
        message:"",
    },{
        name:"quantity",
        type:"input",
        message:"how many units of this product do you want?"
    });/*.then(function(answer){
        if (answer!){
        connection.query(
        "UPDATE products SET ? WHERE ?",
        [{
            products.stock_quantity: products.stock_quantity - answer.quantity
        }]
    
    )}
    });*/