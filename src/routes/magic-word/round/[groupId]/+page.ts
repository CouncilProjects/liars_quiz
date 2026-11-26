import type { PageLoad } from './$types';
import { defaulting } from '../../settings/defaultsettings';
import { type magicWordTeamEntry } from '$lib/types/teamTypes';
import { redirect } from '@sveltejs/kit';

export const load: PageLoad = ({ params }) => {
  let settings = JSON.parse(localStorage.getItem(`magic-word-settings`) || 'null') || defaulting;
  console.log(settings);
  if (!settings) settings = defaulting;
  const retriveTeam = localStorage.getItem(`magic-word-group${params.groupId}`);

  if (retriveTeam == null) {
    throw redirect(302, '/magic-word');
  }


  return { team: JSON.parse(retriveTeam) as magicWordTeamEntry[], settings: settings as typeof defaulting };
};
