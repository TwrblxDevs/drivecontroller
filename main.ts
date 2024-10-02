let soundPlayed: boolean = false;
let StartupPlayed: boolean = false;

class SendDirection {
    public MoveDirection: string;
    public isControllerOnline: boolean;
    public ledState: string;

    constructor(moveDirection?: string, isOnline?: boolean, ledState?: string) {
        this.MoveDirection = moveDirection !== undefined ? moveDirection : "None"; // Default to "None" if undefined
        this.isControllerOnline = isOnline !== undefined ? isOnline : false; // Default to false if undefined
        this.ledState = ledState !== undefined ? ledState : "Off"; // Default to "Off" if undefined
    }

    public updateDirection(newDirection: string) {
        this.MoveDirection = newDirection;
        console.log(`Direction updated to: ${newDirection}`);
    }

    public sendCommand(command: string) {
        console.log(`Broadcasting command: ${command}`);
        radio.sendString(command);
    }

    public toggleControllerStatus() {
        this.isControllerOnline = !this.isControllerOnline;
        console.log(`Controller online status: ${this.isControllerOnline}`);
    }
}

function PlaySound(Sound: any) {
    console.log("PlaySound called with argument: " + Sound);

    if (typeof Sound === "string") {
        if (Sound === "Beep") {
            console.log("Sound is 'Beep'");
            if (!soundPlayed) {
                console.log("Beep sound not played yet, playing sound...");
                soundPlayed = true;
                music.playTone(Note.A, 500);
                pause(500);
                music.playTone(Note.B, 500);
            } else {
                console.log("Beep sound already played, skipping...");
            }
        } else if (Sound === "Startup") {
            console.log("Sound is 'Startup'");
            if (!StartupPlayed) {
                console.log("Startup sound not played yet, starting loading animation...");
                StartupPlayed = true;

                for (let i = 0; i < 3; i++) {
                    console.log("Loading animation frame " + (i + 1));
                    basic.showLeds(`
                        . . # . .
                        . # . # .
                        # . . . #
                        . # . # .
                        . . # . .
                    `);
                    basic.pause(200);
                    basic.showLeds(`
                        . # . # .
                        # . . . #
                        . . . . .
                        # . . . #
                        . # . # .
                    `);
                    basic.pause(200);
                    basic.showLeds(`
                        # . . . #
                        . # . # .
                        . . # . .
                        . # . # .
                        # . . . #
                    `);
                    basic.pause(200);
                }

                console.log("Startup sound playing...");
                music.playTone(Note.A, 500);
                music.playTone(Note.B, 500);
                music.playTone(Note.C, 500);

                console.log("Displaying 'Yes' icon...");
                basic.showIcon(IconNames.Yes);
                pause(100);
                basic.clearScreen();
            } else {
                console.log("Startup sound already played, skipping...");
            }
        }
    } else {
        console.log("Invalid sound type, showing error code...");
        basic.showString("Error Code:");
        pause(100);
        basic.showNumber(23);
        basic.clearScreen();
    }
}

function move(direction: ArrowNames, action: () => void) {
    console.log("Moving in direction: " + direction);
    basic.showArrow(direction);
    basic.pause(1000);
    basic.clearScreen();
    action();
}

function runSafely(fn: () => void, fnName = "anonymous") {
    try {
        console.log(`Running function: ${fnName}`);
        fn();
        console.log(`Function ${fnName} executed successfully.`);
    } catch (error) {
        console.error(`Error in function ${fnName}: ${error.message}`);
    }
}

function checkForErrors() {
    runSafely(() => PlaySound("Startup"), "PlaySound");
}

checkForErrors();

runSafely(() => {
    console.log("Setting radio group to 2...");
    radio.setGroup(2);
}, "Setting radio group");

const controller = new SendDirection(); // You can also pass arguments like:
// const controller = new SendDirection("Forward", true, "Green");

// Tilt detection
input.onGesture(Gesture.TiltLeft, function () {
    console.log("Tilted left");
    controller.updateDirection("Left");
    controller.sendCommand("Left");
});

input.onGesture(Gesture.TiltRight, function () {
    console.log("Tilted right");
    controller.updateDirection("Right");
    controller.sendCommand("Right");
});

input.onGesture(Gesture.LogoUp, function () {
    console.log("Tilted forward");
    controller.updateDirection("Forward");
    controller.sendCommand("Forward");
});

input.onGesture(Gesture.LogoDown, function () {
    console.log("Tilted backward");
    controller.updateDirection("Backward");
    controller.sendCommand("Backward");
});
