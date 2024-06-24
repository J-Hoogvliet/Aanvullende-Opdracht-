import { Scene, Label, Color, Vector, CoordPlane, Font, Actor, Rectangle, Sprite, Input } from 'excalibur';
import { Resources } from './resources';

export class OptionsScene extends Scene {
    constructor(game) {
        super();
        this.game = game;
        this.volume = 0.5; // Initiële volume
        this.backgroundMusic = game.backgroundMusic;
    }

    onInitialize(engine) {
        // Laad opgeslagen volume van localStorage
        const savedVolume = localStorage.getItem('volume');
        if (savedVolume !== null) {
            this.volume = parseFloat(savedVolume);
            this.backgroundMusic.volume = this.volume;
        }

        // Title sprite
        const titleSprite = new Sprite({
            image: Resources.Titel,
            destSize: { width: 1200, height: 600 }
        });
        const titleActor = new Actor({
            pos: new Vector(engine.drawWidth / 2, engine.drawHeight / 2 - 250),
            anchor: new Vector(0.5, 0.5)
        });
        titleActor.graphics.use(titleSprite);
        this.add(titleActor);

        // Volume label
        const volumeLabel = new Label({
            text: 'Volume: ' + Math.round(this.volume * 100) + '%',
            pos: new Vector(engine.drawWidth / 2 - 80, engine.drawHeight / 2 + 120),
            font: new Font({
                size: 30,
                family: 'Arial',
                color: Color.Black,
            }),
            coordPlane: CoordPlane.Screen
        });
        this.add(volumeLabel);

        // Volume bar background (grijze balk)
        const volumeBarBackground = new Actor({
            pos: new Vector(engine.drawWidth / 2, engine.drawHeight / 2 + 100),
            anchor: new Vector(0.5, 0.5)
        });
        volumeBarBackground.graphics.use(new Rectangle({
            width: 300,
            height: 20,
            color: Color.Gray
        }));
        this.add(volumeBarBackground);

        // Volume bar fill
        const volumeBarFill = new Actor({
            pos: new Vector(engine.drawWidth / 2 - 150, engine.drawHeight / 2 + 100),
            anchor: new Vector(0.0, 0.5)
        });
        const volumeFillRectangle = new Rectangle({
            width: this.volume * 300,
            height: 20,
            color: Color.fromHex('#fffea4') 
        });
        volumeBarFill.graphics.use(volumeFillRectangle);
        this.add(volumeBarFill);

        // Volume aanpassen functie
        const adjustVolume = (increment) => {
            this.volume = Math.min(1, Math.max(0, this.volume + increment));
            this.backgroundMusic.volume = this.volume;
            volumeLabel.text = 'Volume: ' + Math.round(this.volume * 100) + '%';
            volumeFillRectangle.width = this.volume * 300;
            localStorage.setItem('volume', this.volume.toString());
        };

        // Increase volume button
        const increaseVolumeButton = new Label({
            text: '+',
            pos: new Vector(engine.drawWidth / 2 + 170, engine.drawHeight / 2 + 85),
            font: new Font({
                size: 30,
                family: 'Arial',
                color: Color.Black,
            }),
            coordPlane: CoordPlane.Screen
        });
        increaseVolumeButton.on('pointerup', () => {
            adjustVolume(0.1);
        });
        this.add(increaseVolumeButton);

        // Decrease volume button
        const decreaseVolumeButton = new Label({
            text: '-',
            pos: new Vector(engine.drawWidth / 2 - 185, engine.drawHeight / 2 + 85),
            font: new Font({
                size: 30,
                family: 'Arial',
                color: Color.Black,
            }),
            coordPlane: CoordPlane.Screen
        });
        decreaseVolumeButton.on('pointerup', () => {
            adjustVolume(-0.1);
        });
        this.add(decreaseVolumeButton);

        // Home button sprite
        const homeSprite = new Sprite({
            image: Resources.Home,
            destSize: { width: 300, height: 75 }
        });
        const homeHoverSprite = new Sprite({
            image: Resources.HomeSelect,
            destSize: { width: 300, height: 75 }
        });

        // Create home button actor
        const home = new Actor({
            pos: new Vector(engine.drawWidth / 2 + 40, engine.drawHeight / 2 + 260),
            anchor: new Vector(0.5, 0.5)
        });
        home.graphics.use(homeSprite);
        this.add(home);

        // Event handler for clicking home button
        home.on('pointerup', () => {
            this.game.goToScene('begin');
        });

        // Event handlers for hover and leave events
        home.on('pointerenter', () => {
            home.graphics.use(homeHoverSprite);
        });

        home.on('pointerleave', () => {
            home.graphics.use(homeSprite);
        });
    }

    onPreUpdate(engine, delta) {
        // Controleer gamepad input
        const gamepad = engine.input.gamepads.at(0);
        if (gamepad) {
            if (gamepad.isButtonPressed(Input.Buttons.DpadUp)) {
                adjustVolume(0.1);
            } else if (gamepad.isButtonPressed(Input.Buttons.DpadDown)) {
                adjustVolume(-0.1);
            } else if (gamepad.isButtonPressed(Input.Buttons.Face2)) {
                this.game.goToScene('begin');
            }
        }
    }
}
