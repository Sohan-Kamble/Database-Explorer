import { spawn } from 'child_process';
import path from 'path';

export async function POST(req) {
    const scriptPath = path.join(process.cwd(), 'backend', 'voice-cmd.py');

    const pythonProcess = spawn('python', [scriptPath]);

    let output = '';

    pythonProcess.stdout.on('data', (data) => {
        output += data.toString();
        console.log(`stdout: ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    return new Promise((resolve) => {
        pythonProcess.on('close', (code) => {
            console.log(`Python script exited with code ${code}`);
            resolve(Response.json({ message: 'Python script executed', output }));
        });
    });
}

