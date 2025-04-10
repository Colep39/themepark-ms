import './Shops.css';
import ShopItem from './ShopItem';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdventureGear(){
    const [items, setItems] = useState([]);

    const API_BASE_URL = 'https://themepark-backend-bcfpc8dvabedfcbt.centralus-01.azurewebsites.net/api/shop'; 

        useEffect(() => {
        fetchShop();
    }, []);

    const fetchShop = async () => {
        try {
            const response = await axios.get(API_BASE_URL);
            console.log("Fetched Shop data:", response.data);
    
            // Filter for only items that match this shop
            const filteredItems = response.data.filter(item => item.shop_name === "Adventure_Gear");
            setItems(filteredItems);
            console.log(filteredItems);
    
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    };
    

    return(
        <>
            <div id='adventure-container'>
                <h1 id="shop-header">Adventure Gear - Featured Items</h1>

                <div className="shop-items-container">
                    {/*}
                    <ShopItem src="/images/nah-id-win-shirt.jpeg" shopItemName="Gojos Declaration" price="15.00"/>
                    <ShopItem src="/images/beach-ball.avif" shopItemName="Beach Ball" price="5.00"/>
                    <ShopItem src="/images/uma-zooma-hat.webp" shopItemName="UmaZooma Hat" price="10.00"/>
                    <ShopItem src="/images/flip-flops.jpg" shopItemName="Flip Flops" price="10.00"/>
                    <ShopItem src="/images/plush-small-lion.jpg" shopItemName="Speaking Lion" price="25.00" />
                    <ShopItem src="/images/sunglasses.jpg" shopItemName="Sunglasses" price="12.00"/>
                    <ShopItem src="/images/sunscreen.jpg" shopItemName="Sun Screen" price="8.00"/>
                    <ShopItem src="/images/water noodle.jpg" shopItemName="Water Noodle" price="6.00"/>
                    <ShopItem src="/images/swim-trunks.webp" shopItemName="Swim Trunks" price="18.00"/>
                    <ShopItem src="/images/water-gun1.jpg" shopItemName="Water Rifle" price="30.00"/>
                    <ShopItem src="/images/umabrella.webp" shopItemName="UmaBrella" price="20.00"/>
                    <ShopItem src="/images/water-gun2.jpg" shopItemName="Dual Blasters" price="19.00"/>
                    */}

                    {items.map((item, index) => (
                        <ShopItem 
                            key={index}
                            src={item.item_img}
                            shopItemName={item.item_name}
                            price={item.item_price}
                        />
                    ))}
                </div>
            </div>
        </>
    )
}