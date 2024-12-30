// Show modal on load
window.onload = () => {
    const welcomeModal = new bootstrap.Modal(document.getElementById('welcomeModal'));
    welcomeModal.show();
};

// Update line numbers dynamically as user types
function updateLineNumbers(textareaId, lineNumberId) {
    const textarea = document.getElementById(textareaId);
    const lineNumbers = document.getElementById(lineNumberId);

    const updateNumbers = () => {
        const contentLines = textarea.value.split('\n');
        const lineCount = contentLines.length;
        lineNumbers.innerHTML = Array.from({ length: lineCount }, (_, i) => i + 1).join('<br>');
    };

    // Initial call to populate line numbers based on initial content
    updateNumbers();

    // Add event listener to update line numbers on input
    textarea.addEventListener('input', updateNumbers);
}

// Show error messages in a popup
function showErrorPopup(message) {
    const errorPopup = document.getElementById('errorPopup');
    if (errorPopup) {
        errorPopup.textContent = message;
        errorPopup.style.display = 'block';
        setTimeout(() => {
            errorPopup.style.display = 'none';
        }, 5000);
    } else {
        alert(`Error: ${message}`);
    }
}

// Redirect console logs and errors to the preview section
(function overrideConsole() {
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    const preview = document.getElementById('preview');

    console.log = function (...args) {
        const message = args.map(arg => JSON.stringify(arg, null, 2)).join(' ');
        const logDiv = document.createElement('div');
        logDiv.textContent = `LOG: ${message}`;
        logDiv.style.color = 'green';
        logDiv.style.fontFamily = 'monospace';
        preview.appendChild(logDiv);
        originalConsoleLog(...args);
    };

    console.error = function (...args) {
        const message = args.map(arg => JSON.stringify(arg, null, 2)).join(' ');
        showErrorPopup(`ERROR: ${message}`);
        const errorDiv = document.createElement('div');
        errorDiv.textContent = `ERROR: ${message}`;
        errorDiv.style.color = 'red';
        errorDiv.style.fontFamily = 'monospace';
        preview.appendChild(errorDiv);
        originalConsoleError(...args);
    };

    // Clear the preview section before running new code
    document.getElementById('runCode').addEventListener('click', () => {
        preview.innerHTML = '<p style="text-align:center; color:grey;">Running code... Preview output will be displayed here.</p>';
    });
})();

// Run and render the code in the preview area
document.getElementById('runCode').addEventListener('click', function () {
    const htmlCode = document.getElementById('htmlCode').value.trim();
    const cssCode = document.getElementById('cssCode').value.trim();
    const jsCode = document.getElementById('jsCode') ? document.getElementById('jsCode').value.trim() : '';

    if (!htmlCode && !cssCode) {
        showErrorPopup('Please add HTML or CSS code before clicking Run.');
        return;
    }

    const previewFrame = document.getElementById('preview');
    previewFrame.innerHTML = '';

    try {
        const shadowRoot = previewFrame.shadowRoot || previewFrame.attachShadow({ mode: 'open' });
        shadowRoot.innerHTML = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <style>${cssCode}</style>
            </head>
            <body>${htmlCode}</body>
            </html>
        `;

        if (jsCode) {
            const script = document.createElement('script');
            script.type = 'module';
            script.textContent = jsCode;
            shadowRoot.appendChild(script);
        }
    } catch (error) {
        showErrorPopup(`JavaScript Execution Error: ${error.message}`);
    }
});

// Get the line number of the error from the stack trace
function getErrorLine(error) {
    const match = error.stack.match(/<anonymous>:(\d+):(\d+)/);
    return match ? match[1] : 'unknown';
}

// Initialize line numbers for all textareas and placeholders
document.addEventListener('DOMContentLoaded', () => {
    const htmlCode = document.getElementById('htmlCode');
    const cssCode = document.getElementById('cssCode');

    htmlCode.value = '<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Welcome to the HTML Editor by Developer Gowtham</title>\n</head>\n<body>\n    <h1>Hello, World!</h1>\n    <p>Start editing your HTML here...</p>\n</body>\n</html>';
    cssCode.value = '/* Welcome to the CSS Editor by Developer Gowtham */\nbody {\n    font-family: Arial, sans-serif;\n    background-color: #f0f0f0;\n    color: #333;\n}\nh1 {\n    color: #007bff;\n}\np {\n    font-size: 16px;\n}';

    updateLineNumbers('htmlCode', 'htmlLineNumbers');
    updateLineNumbers('cssCode', 'cssLineNumbers');

    if (document.getElementById('jsCode')) {
        updateLineNumbers('jsCode', 'jsLineNumbers');
        document.getElementById('jsCode').value = '// Welcome to the JavaScript Editor by Developer Gowtham\n// Start scripting your ideas here!';
    }
});

// Function to copy code from editors
function copyCode(editorId) {
    const editor = document.getElementById(editorId);
    if (editor) {
        navigator.clipboard.writeText(editor.value).then(() => {
            alert(`${editorId} content copied to clipboard!`);
        }).catch(err => {
            showErrorPopup(`Error copying text: ${err.message}`);
        });
    }
}

// Toggle Dark/Light Mode
document.getElementById('toggleMode').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const toggleButton = document.getElementById('toggleMode');
    toggleButton.textContent = document.body.classList.contains('dark-mode') ? 'Switch to Light Mode' : 'Switch to Dark Mode';
});

// Initialize EmailJS
(function () {
    emailjs.init("hdueE7bUifAPG9EJh"); // Replace with your Public Key
})();

// Function to send email
function sendEmail(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    // Get form values
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    // Template parameters for emailjs
    const templateParams = {
        to_name: "gowtham",
        from_name: name,
        from_email: email,
        message: message,
        reply_to: email
    };

    // Send email using emailjs
    emailjs.send("service_hiqcowq", "template_b0yggtu", templateParams)
        .then(() => {
            alert("Email Sent Successfully!");
        })
        .catch((error) => {
            console.error("Error:", error);
            alert("Failed to send the email. Check the console for details.");
        });

    // Reset the form
    document.getElementById("contact").reset();
}
