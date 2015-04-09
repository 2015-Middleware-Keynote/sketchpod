# 1k-cattle [![Dependency Check](http://img.shields.io/david/ryanj/1k-cattle.svg)](https://david-dm.org/ryanj/1k-cattle)

[![Launch on OpenShift](https://launch-shifter.rhcloud.com/launch.svg)](https://openshift.redhat.com/app/console/application_type/custom?cartridges%5B%5D=nodejs-0.10&initial_git_url=https%3A%2F%2Fgithub.com%2Fryanj%2F1k-cattle.git&name=cattle)

To deploy a clone of this application using the [`rhc` command line tool](http://rubygems.org/gems/rhc):

    rhc app create cattle nodejs-0.10 --from-code=https://github.com/ryanj/1k-cattle.git
    
Or [link to a web-based clone+deploy](https://openshift.redhat.com/app/console/application_type/custom?cartridges%5B%5D=nodejs-0.10&initial_git_url=https%3A%2F%2Fgithub.com%2Fryanj%2F1k-cattle.git) on [OpenShift Online](http://OpenShift.com) or on [your own OpenShift cloud](http://openshift.github.io): 

    https://openshift.redhat.com/app/console/application_type/custom?cartridges%5B%5D=nodejs-0.10&initial_git_url=https%3A%2F%2Fgithub.com%2Fryanj%2F1k-cattle.git

## Local Development
Install dependencies:

```bash
npm install
```

Start a local server, passing in config via the environment:

```bash
DEMO_USER_ID=007 DEMO_CLAIM="openshift for the win!" npm start
```

## Docker
To run [the related docker image](https://registry.hub.docker.com/u/ryanj/1k-cattle/):

```bash
docker pull ryanj/1k-cattle
docker run -d -p 8080:8080 -e "HOSTNAME=localhost" -e "DEMO_USER_ID=007" -e "DEMO_CLAIM=openshift for the win!" ryanj/1k-cattle
```

## License
This code is dedicated to the public domain to the maximum extent permitted by applicable law, pursuant to CC0 (http://creativecommons.org/publicdomain/zero/1.0/)
