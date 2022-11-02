# 📌 Email_API <br>


<br>

## ✔️ Now the API supports Firebase Authentication and also you can test it via Mocha and Chai.

<br>

## 🔑 Environment Variables 
### ☑️ Before running any test, you need to add the following environment variables

- #### ` Config/fbServiceAccountKey.json `  -   holds  firebase private key
- #### ` .env file ` - holds sendGrid API-KEY
### ☑️ additionally, you need to configure these on  ` /GebeyaEmailAPI/test/api-test.js `

- #### ` firebaseConfig ` - put your web app's Firebase configuration
- #### `invalid_values  object ` - should contain invalid values for each corresponding key-value pair
- #### `user_info  object ` - should be a user registered on firebase for Authenticatio
 
### ☑️ And, inside  ` beforeEach() ` Mocha hook 
- #### ` from ` and ` to ` part of  `data object`
- #### ` data.templateId ` should be ` valid templateID ` 


<br>


##  📌 <a href="https://gitlab.tools.gebeya.io/dawit01/email_api/-/blob/main/sample_jsonfile.json"> And here is the  sample json file the API expects. <a>


<br>


<br>


## 🧰 Getting Started

You will need Node.js runtime environment and npm package manager installed in your machine, to run this project.

### Node & npm

- #### Node & npm installation

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.

If the installation was successful, you should be able to run the following command.

    $ node --version
    v8.11.3 // yours may be different

    $ npm --version
    6.1.0 // yours may be different

---

### ⚙️ Install/Donwnload Project

     git < put cloning link here >



### 🏃 Run Test


##### You need to have ` Docker desktop ` installed in your local machine, and run the following command :
     docker-compose up

<br>

After runnig the above command, all of the test cases start executing one by one.



<br>

<br><br>
