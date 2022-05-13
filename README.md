
# cercet ![CI](https://github.com/Paul2708/cercet/workflows/CI/badge.svg)

The Collaborative Educational Remote Code Execution and Teaching (CERCET) tool is a website that allows teachers to have a look at their students.
Students and teachers can program small Java applications.
They can compile and execute it as well.

The main capability is that the teachers can observe the students' editors.
In addition, the students will see the teachers cursors.

At this point, I want to thank [@NyCodeGHG](https://github.com/NyCodeGHG) for her contributions.
The fast development would not be possible without her. :heart:

If you are interested, you may have a look at the ["documentation"](./documentation).

## Current state
At the moment, CERCET is WIP.
However, the current state is a minimal valuable product.

**Important note:** 
Cercet is currently missing some security related features.
The following things need to be considered while running:

 - The Java code execution is not restricted by any means. There is no security manager implemented yet. 
 - For example, users can execute a command (by Java Runtime exec function) to shut down the Docker container.  Therefore keep an eye on who gets access to the application.

## Run it
1. Clone the repository by `git clone https://github.com/Paul2708/cercet.git`.
2. Edit `docker-compose.yml` and `frontend/src/environments/environment.prod.ts/` by replacing `cercet.paul2708.de` with your domain.
3. Copy [config.yaml](backend/server/src/main/resources/config.yaml) into the project root directory and edit the tokens.
4. Run `docker-compose up`.

## Contribute
If you want to contribute, just hit me up on Discord (Paul2708#1098) or open an issue for discussion.
