# Express Proxy

## Overview

Express Proxy is a Node.js application that uses the Express framework to create a proxy server. This proxy server can forward requests to a target host and modify the responses as needed. It supports HTTPS and allows for configuration through a JSON file.

## Features

- Proxy requests to a target host.
- Modify response headers and body.
- Support for HTTPS.
- Configurable through a JSON file.
- Easy to set up and run.

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/WhityGhost/Express-proxy.git
   cd Express-proxy
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Create SSL certificates:

   Place your SSL key and certificate files in the root directory of the project and name them `rootSSL.dec.key` and `rootSSL.pem` respectively.

4. Create a configuration file:

   Create a `.proxyrc.json` file in the root directory of the project or in your home directory with the following structure:

   ```json
   {
     "targetHost": "example.com",
     "host": "localhost",
     "port": 3000,
     "cookieReplacer": [
       {
         "from": "example.com",
         "to": "localhost"
       }
     ]
   }
   ```

   Replace the values with your actual configuration.

## Usage

1. Start the server:

   ```sh
   npm start
   ```

   or for development with automatic restarts:

   ```sh
   npm run dev
   ```

2. The proxy server will start listening on the port specified in your configuration file. You can now make requests to the proxy server, and it will forward them to the target host.

## Configuration

The proxy server can be configured using a JSON file. The configuration file should be named `.proxyrc.json` and can be placed either in the root directory of the project or in your home directory.

### Configuration Options

- `targetHost`: The host to which requests should be proxied.
- `host`: The local host name.
- `port`: The port on which the proxy server will listen.
- `cookieReplacer`: An array of objects for replacing parts of cookies in the response headers.

### Example Configuration

```json
{
  "targetHost": "example.com",
  "host": "localhost",
  "port": 3000,
  "cookieReplacer": [
    {
      "from": "example.com",
      "to": "localhost"
    }
  ]
}
```
