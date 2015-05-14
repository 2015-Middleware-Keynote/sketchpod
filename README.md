# DoodlePod [![Dependency Check](http://img.shields.io/david/ryanj/doodlepod.svg)](https://david-dm.org/ryanj/doodlepod)

[![Launch on OpenShift](https://launch-shifter.rhcloud.com/launch.svg)](https://openshift.redhat.com/app/console/application_type/custom?cartridges%5B%5D=nodejs-0.10&initial_git_url=https%3A%2F%2Fgithub.com%2Fryanj%2Fdoodlepod.git&name=doodlepod)

To deploy a clone of this application using the [`rhc` command line tool](http://rubygems.org/gems/rhc):

    rhc app create doodlepod nodejs-0.10 --from-code=https://github.com/ryanj/doodlepod.git
    
Or [link to a web-based clone+deploy](https://openshift.redhat.com/app/console/application_type/custom?cartridges%5B%5D=nodejs-0.10&initial_git_url=https%3A%2F%2Fgithub.com%2Fryanj%2Fdoodlepod.git) on [OpenShift Online](http://OpenShift.com) or on [your own OpenShift cloud](http://openshift.github.io): 

    https://openshift.redhat.com/app/console/application_type/custom?cartridges%5B%5D=nodejs-0.10&initial_git_url=https%3A%2F%2Fgithub.com%2Fryanj%2Fdoodlepod.git

## Local Development
Install dependencies:

```bash
npm install
```

Start a local server, passing in config via the environment:

```bash
CUID=007 USERNAME=foo SUBMISSION="openshift for the win!" npm start
```

Next, load the index page to check the initial content.  Then run upload an image by running the `post_image.manual.js` script in another terminal:

```bash
node post_image.manual.js
```

Reload the index page to verify that the doodlepod has received it's content submission.

## Docker
To run [the related docker image](https://registry.hub.docker.com/u/ryanj/doodlepod/):

```bash
docker pull ryanj/doodlepod
docker run -d -p 8080:8080 -e "HOSTNAME=localhost" -e "CUID=007" -e "USERNAME=user007" -e "SUBMISSION=openshift for the win!" ryanj/doodlepod
```

## OpenShiftV3
First, choose an application name for this service and update the template to replace all instances of `APP_NAME`:

```bash
sed -i -e 's/APPNAME/doodlepod/g' app_template.json
```

Then, launch the service using the `osc` command-line tool:
```bash
osc create -f app_template.json
```

## License
This code is dedicated to the public domain to the maximum extent permitted by applicable law, pursuant to CC0 (http://creativecommons.org/publicdomain/zero/1.0/)
