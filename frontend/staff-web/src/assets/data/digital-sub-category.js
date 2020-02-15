import React from 'react';
import logo from '../images/digital-product/logo.jpg';
import php from '../images/digital-product/php.png';
import html from '../images/digital-product/html.png';
import css from '../images/digital-product/css.jpg';
import web from '../images/digital-product/web-element.jpg';
import wordpress from '../images/digital-product/wordpress.jpg';
import design from '../images/digital-product/3d-design.jpg'

const data = [
    {
        image: <img src={logo} style={{width:50,height:50}}/>,
        product_name: "Logo Design",
        price: "$74.00",
        status: <i className="fa fa-circle font-success f-12" />,
        category: "Digital"
    },
      {
        image: <img src={php} style={{width:50,height:50}} />,
        product_name: "Php",
        price: "$213.00",
        status: <i className="fa fa-circle font-warning f-12"></i>,
        category: "Digital"
    },
    {
        image: <img src={html} style={{width:50,height:50}} />,
        product_name: "HTML",
        price: "$254.00",
        status:<i className="fa fa-circle font-success f-12"></i> ,
        category: "Digital"
    },
    {
        image: <img src={css} style={{width:50,height:50}} />,
        product_name: "CSS",
        price: "$794.00",
        status:<i className="fa fa-circle font-success f-12"></i>,
        category: "Digital"
    },
    {
        image: <img src={web} style={{width:50,height:50}} />,
        product_name: "Web element",
        price: "$5765.00",
        status: <i className="fa fa-circle font-danger f-12"></i>,
        category: "Digital"
    },
    {
        image: <img src={wordpress} style={{width:50,height:50}} />,
        product_name: "Wordpress",
        price: "$347.00",
        status: <i className="fa fa-circle font-danger f-12"></i>,
        category: "Digital"
    },
    {
        image: <img src={design} style={{width:50,height:50}} />,
        product_name: "3D Design",
        price: "$5765.00",
        status: <i className="fa fa-circle font-success f-12"></i>,
        category: "Digital"
    }
]

export default data;