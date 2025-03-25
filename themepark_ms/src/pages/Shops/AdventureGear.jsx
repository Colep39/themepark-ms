import './Shops.css';
import ShopItem from './ShopItem';

export default function AdventureGear(){
    return(
        <>
            <div id='adventure-container'>
                <h1 id="shop-header">Adventure Gear - Featured Items</h1>

                <div className="shop-items-container">
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
                </div>
            </div>
        </>
    )
}