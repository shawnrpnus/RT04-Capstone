import React from 'react';
import logo from '../images/digital-product/logo.jpg';
import php from '../images/digital-product/php.png';
import html from '../images/digital-product/html.png';
import css from '../images/digital-product/css.jpg';
import design from '../images/digital-product/3d-design.jpg';
import webdev from '../images/digital-product/web-dev.jpg'
import graphic from '../images/digital-product/graphic-design.png';
import application from '../images/digital-product/application.jpg';
import ebooks from '../images/digital-product/ebooks.png';

const data = [
    {
        id:21,
        image: <img src={webdev} style={{width:50,height:50}}/>,
        product_title: "Websites",
        entry_type:'Add',
        quantity: "5",
       
    },
      {
        id:172,
        image: <img src={design} style={{width:50,height:50}} />,
        product_title: "3D Design",
        entry_type:'Destroy',
        quantity: "11",
       
    },
    {
        id:124,
        image: <img src={graphic} style={{width:50,height:50}} />,
        product_title: "Graphic Design",
        entry_type:'Destroy',
        quantity: "154",
       
    },
    {
        id:37,
        image: <img src={logo} style={{width:50,height:50}} />,
        product_title: "Company Logo",
        entry_type:'Destroy',
        quantity: "1",
       
    },
    {
        id:67,
        image: <img src={application} style={{width:50,height:50}} />,
        product_title: "Application",
        entry_type:'Add',
        quantity: "24",
       
    },
    {
        id:74,
        image: <img src={php} style={{width:50,height:50}} />,
        product_title: "Php",
        entry_type:'Destroy',
        quantity: "1",
       
    },
    {
        id:427,
        image: <img src={html} style={{width:50,height:50}} />,
        product_title: "HTML",
        entry_type:'Destroy',
        quantity: "27",
       
    },
    {
        id:142,
        image: <img src={css} style={{width:50,height:50}} />,
        product_title: "CSS",
        entry_type:'Add',
        quantity: "2",
    },
    {
        id:58,
        image: <img src={ebooks} style={{width:50,height:50}} />,
        product_title: "ebooks",
        entry_type:'Add',
        quantity: "4",
    }
]

export default data;