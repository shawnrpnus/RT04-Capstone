import React from 'react'
import pro23 from '../images/dashboard/product/20.jpg';
import pro1 from '../images/dashboard/product/19.jpg';
import pro18 from '../images/dashboard/product/18.jpg';
import pro21 from '../images/dashboard/product/17.jpg';
import pro3 from '../images/dashboard/product/16.jpg';
import tools20 from '../images/dashboard/product/15.jpg';
import pro14 from '../images/dashboard/product/14.jpg';
import pro20 from '../images/dashboard/product/13.jpg';
import pro19 from '../images/dashboard/product/12.jpg';
import jwel18 from '../images/dashboard/product/11.jpg';
import jwel12 from '../images/dashboard/product/10.jpg';
import jwel26 from '../images/dashboard/product/9.jpg';
import cat3 from '../images/dashboard/product/7.jpg';
import fashion12 from '../images/dashboard/product/6.jpg';
import shoes from '../images/dashboard/product/5.jpg';
import pro06 from '../images/dashboard/product/4.jpg';
import pro9 from '../images/dashboard/product/3.jpg';
import pro6 from '../images/dashboard/product/2.jpg';

const data = [
    {
        image: <img src={pro23} style={{width:50,height:50}} />,
        product_name: "Steering Wheels",
        price: "$46.00",
        status: <i className="fa fa-circle font-danger f-12" />,
        category: "Electronics"
    },
      {
        image: <img src={pro1} style={{width:50,height:50}} />,
        product_name: "Motor Vehicle Tyres",
        price: "$671.00",
        status: <i className="fa fa-circle font-success f-12" />,
        category: "Electronics"
    },
    {
        image: <img src={pro18} style={{width:50,height:50}} />,
        product_name: "Automotive Battery",
        price: "$368.00",
        status: <i className="fa fa-circle font-success f-12" />,
        category: "Electronics"
    },
    {
        image:<img src={pro21} style={{width:50,height:50}} />,
        product_name: "Apple 6s",
        price: "$725.00",
        status:<i className="fa fa-circle font-warning f-12" />,
        category: "Electronics"
    },
    {
        image:<img src={pro3} style={{width:50,height:50}} />,
        product_name: "Printer",
        price: "$4825.00",
        status:<i className="fa fa-circle font-danger f-12" />,
        category: "Electronics"
    },
    {
        image:<img src={tools20} style={{width:50,height:50}} />,
        product_name: "Bucket Seat",
        price: "$25.00",
        status:<i className="fa fa-circle font-warning f-12" />,
        category: "Electronics"
    },
    {
        image:<img src={pro14} style={{width:50,height:50}} />,
        product_name: "Canon Camera",
        price: "$2461.00",
        status:<i className="fa fa-circle font-warning f-12" />,
        category: "Electronics"
    },
    {
        image:<img src={pro20} style={{width:50,height:50}} />,
        product_name: "High uality Headphones",
        price: "$761.00",
        status:<i className="fa fa-circle font-success f-12" />,
        category: "Electronics"
    },
    {
        image:<img src={pro19}  style={{width:50,height:50}}/>,
        product_name: "Hom Theater Speakers",
        price: "$672.00",
        status:<i className="fa fa-circle font-success f-12" /> ,
        category: "Electronics"
    },
    {
        image: <img src={pro18} style={{width:50,height:50}} />,
        product_name: "Diamond Ring",
        price: "$237.00",
        status: <i className="fa fa-circle font-success f-12" />,
        category: "Jewellery"
    },
    {
        image: <img src={jwel12} style={{width:50,height:50}}/>,
        product_name:"Diamond Nacklace",
        price: "$3579.00",
        status:<i className="fa fa-circle font-danger f-12" />,
        category: "Jewellery"
    },
    {
        image:<img src={jwel26} style={{width:50,height:50}} />,
        product_name:"Diamond Earrings",
        price: "$3145.00",
        status:<i className="fa fa-circle font-warning f-12" />,
        category: "Jewellery"
    },
    {
        image: <img src={pro1} style={{width:50,height:50}} />,
        product_name: "Night lamp",
        price: "$84.00",
        status:<i className="fa fa-circle font-danger f-12" /> ,
        category: "furniture"
    },
    {
        image:<img src={cat3} style={{width:50,height:50}} />,
        product_name: "men's shoes",
        price: "$67.00",
        status:<i className="fa fa-circle font-danger f-12" /> ,
        category: "shoes"
    },
    {
        image: <img src={fashion12} style={{width:50,height:50}} />,
        product_name: "Ledi's red top",
        price: "$234.00",
        status: <i className="fa fa-circle font-danger f-12" />,
        category: "clothes"
    },
    {
        image: <img src={shoes} style={{width:50,height:50}} />,
        product_name: "atest ledis shoes",
        price: "$357.00",
        status:<i className="fa fa-circle font-warning f-12" /> ,
        category: "shoes"
    },
    {
        image: <img src={pro06} style={{width:50,height:50}} />,
        product_name: "Woman one pis",
        price: "$682.00",
        status: <i className="fa fa-circle font-danger f-12" />,
        category: "clothes"
    },
    {
        image: <img src={pro9} style={{width:50,height:50}} />,
        product_name: "Mouse",
        price: "$24.00",
        status:<i className="fa fa-circle font-danger f-12" /> ,
        category: "electronics"
    },
    {
        image: <img src={pro6} style={{width:50,height:50}} />,
        product_name: "Coffee maker",
        price: "$9721.00",
        status: <i className="fa fa-circle font-danger f-12" />,
        category: "electronics"
    },
    {
        image: <img src={jwel18} style={{width:50,height:50}} />,
        product_name:"Diamond Ring",
        price: "$3579.00",
        status:<i className="fa fa-circle font-danger f-12" />,
        category: "Jewellery"
    }
  
]

export default data;
