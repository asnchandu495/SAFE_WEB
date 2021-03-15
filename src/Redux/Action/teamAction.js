import { LOAD_ALL_TEAMS } from "../utilits";
import TeamService from '../../services/teamService';

const teamApiCall=new TeamService();

export function LoadAllTeams(loadTeam){
    return { type: LOAD_ALL_TEAMS,loadTeam };
}

export function loadTeam(){
    return function (dispatch){
        return teamApiCall
        .getTeamList()
        .then((response)=>{
            // console.log(response);
            dispatch(LoadAllTeams(response));
        })
        .catch((error)=>{
        throw error;
        
         });
    };
}