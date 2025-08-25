/**
 * project controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::project.project', ({ strapi }) => ({
    async find(ctx) {
        ctx.query = {
            ...ctx.query,
            populate: {
                previewImage: true, // or '*'
                techStacks: true,
                primaryStack: true,
            },
        };

        const { data, meta } = await super.find(ctx);

        const formattedData = data.map(d => ({
            id: d.documentId,
            title: d.title,
            shortDescription: d.shortDescription,
            previewImage: d.previewImage,
            primaryStack: d.primaryStack.name,
            techStacks: d.techStacks.map(stack => stack.name)
        }))


        return { data: formattedData, meta };
    },

    async findOne(ctx) {
        ctx.query = {
          ...ctx.query,
          populate: {
            mainImage: true,
            techStacks: true,
            primaryStack: true,
          },
        };
      
        const { data } = await super.findOne(ctx);
      
    
      
        return {
            id: data.documentId,
            title: data.title,
            content: data.shortDescription,
            mainImage: data.mainImage,
            primaryStack: data.primaryStack.name,
            techStacks: data.techStacks.map(stack => stack.name)
        };
      }
}));

