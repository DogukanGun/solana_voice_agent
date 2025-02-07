const fs = require('fs');
const { exec } = require('child_process');
const fetch = require('node-fetch'); // Import node-fetch


// Function to generate claim data from trade verification
function generateClaimData(tradeResult, expectedResult) {
    return {
        tradeResult: tradeResult,
        expectedResult: expectedResult,
        timestamp: new Date().toISOString(),
    };
}

// Function to create input.json
export function createInputFile(tradeResult, expectedResult,onSuccess) {
    const input = {
        tradeResult: tradeResult,
        expectedResult: expectedResult
    };

    fs.writeFileSync('input.json', JSON.stringify(input, null, 2));
    console.log('input.json created with the following content:');
    console.log(input);

    // Generate claim data
    const claimData = generateClaimData(tradeResult, expectedResult);
    console.log('Claim data generated:', claimData);

    // Proceed with witness generation
    runWitnessGeneration(claimData,onSuccess); // Pass claim data to witness generation
}

// Function to run the witness generation command
function runWitnessGeneration(claimData,onSuccess) {
    exec('node tradeVerification_js/generate_witness.js tradeVerification.wasm input.json witness.wtns', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing command: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        
        // After generating the witness, calculate it using snarkjs
        calculateWitness(claimData,onSuccess);
    });
}

// Function to calculate the witness using snarkjs
function calculateWitness(claimData,onSuccess) {
    exec('snarkjs wtns calculate tradeVerification.wasm input.json witness.wtns', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing snarkjs command: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }
        console.log(`Witness calculated successfully: ${stdout}`);
        
        // After calculating the witness, perform pre-login and login
        const res = preLogin(publicKey,claimData);  
        onSuccess(res);
    });
}

// Function for pre-login
async function preLogin(publicKey,claimData) {
    try {
        const response = await fetch('https://api.witnesschain.com/proof/v1/pol/pre-login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                publicKey: publicKey,
                keyType: 'solana',
                role: 'prover',
                claims: claimData
            })
        });

        if (!response.ok) {
            throw new Error(`Pre-login failed! status: ${response.status}`);
        }

        const data = await response.json();
        const sessionToken = data.session_token;
        console.log(`Pre-login successful. Session Token: ${sessionToken}`);

        return login(sessionToken);
    } catch (error) {
        console.error(`Error during pre-login: ${error.message}`);
    }
}

// Function for login
async function login(sessionToken) {
    try {
        const response = await fetch('https://api.witnesschain.com/proof/v1/pol/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sessionToken: sessionToken
            })
        });

        if (!response.ok) {
            throw new Error(`Login failed! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(`Login successful. User ID: ${data.user_id}`);

        return submitChallenge(claimData);
    } catch (error) {
        console.error(`Error during login: ${error.message}`);
    }
}

// Function to submit the challenge and get the challenge ID
async function submitChallenge(claimData) {
    try {
        const response = await fetch('https://api.witnesschain.com/proof/v1/pol/challenge-request-dcl', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                publicKey: 'your_public_key',
                keyType: 'your_key_type',
                role: 'your_role',
                claims: claimData
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const challengeId = data.challenge_id;
        console.log(`Challenge submitted successfully. Challenge ID: ${challengeId}`);
        
        return challengeId;

    } catch (error) {
        console.error(`Error submitting challenge: ${error.message}`);
    }
}