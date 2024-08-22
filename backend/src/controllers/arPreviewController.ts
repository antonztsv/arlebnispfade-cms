import { Request, Response } from 'express';
import config from '@/config';
import * as poiService from '@/services/poiService';
import { NotFoundError } from '@/utils/errorHandler';

export async function getARPreview(req: Request, res: Response) {
  try {
    const { routeId, poiId } = req.params;
    console.log('Generating AR preview for route', routeId, 'and POI', poiId);

    const poi = await poiService.getPOIById(routeId, poiId);

    if (!poi) {
      throw new NotFoundError(`POI with id ${poiId} not found in route ${routeId}`);
    }

    const nft = poi.ar?.nft?.[0];

    const templateData = {
      poiTitle: poi.title,
      nftUrl: `https://raw.githubusercontent.com/${config.githubRepoOwner}/${config.githubRepoName}/main/src/${routeId}/ar-media/images/${nft.id}`,
      modelUrl: `https://raw.githubusercontent.com/${config.githubRepoOwner}/${config.githubRepoName}/main/src/${routeId}/ar-media/models/${nft.model}.glb`,
      nftScale: nft.scale,
      nftPosition: nft.position,
      nftRotation: nft.rotation,
    };

    console.log('AR preview template data:', templateData);

    res.render('ar-preview', templateData);
  } catch (error) {
    console.error('Error generating AR preview:', error);
    res.status(500).send('Error generating AR preview');
  }
}
