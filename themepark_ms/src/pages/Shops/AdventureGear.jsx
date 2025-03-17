import './Shops.css';
import ShopItem from './ShopItem';

export default function AdventureGear(){
    return(
        <>
            <div id='adventure-container'>
                <h1 id="shop-header">Adventure Gear - Online Exclusive Items!</h1>

                <div className="shop-items-container">
                    <ShopItem src="src/images/nah-id-win-shirt.jpeg" shopItemName="Gojos Declaration" price="15.00"/>
                    <ShopItem src="src/images/beach-ball.avif" shopItemName="Beach Ball" price="5.00"/>
                    <ShopItem src="src/images/uma-zooma-hat.webp" shopItemName="UmaZooma Hat" price="10.00"/>
                    <ShopItem src="src/images/flip-flops.jpg" shopItemName="Flip Flops" price="10.00"/>
                    <ShopItem src="src/images/plush-small-lion.jpg" shopItemName="Speaking Lion" price="25.00" />
                    <ShopItem src="src/images/sunglasses.jpg" shopItemName="Sunglasses" price="12.00"/>
                    <ShopItem src="src/images/sunscreen.jpg" shopItemName="Uma Screen" price="8.00"/>
                    <ShopItem src="src/images/water noodle.jpg" shopItemName="Water Noodle" price="6.00"/>
                    <ShopItem src="src/images/swim-trunks.webp" shopItemName="Swim Trunks" price="18.00"/>
                    <ShopItem src="src/images/water-gun1.jpg" shopItemName="Umas Glock" price="30.00"/>
                    <ShopItem src="src/images/umabrella.webp" shopItemName="UmaBrella" price="20.00"/>
                    <ShopItem src="src/images/water-gun2.jpg" shopItemName="Dual Umas" price="19.00"/>
                </div>
            </div>
        </>
    )
}