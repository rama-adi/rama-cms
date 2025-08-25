/**
 * award controller
 */


import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::award.award', ({ strapi }) => ({
    async find(ctx) {
        ctx.query = {
            ...ctx.query,
            populate: {
                mainImage: true
            },
        };

        const { data, meta } = await super.find(ctx);

        const formattedData = data.map(d => ({
            id: d.documentId,
            title: d.title,
            mainImage: d.mainImage
        }))


        return { data: formattedData, meta };
    },

    async findOne(ctx) {
        ctx.query = {
            ...ctx.query,
            populate: {
                mainImage: true
            },
        };

        const { data } = await super.findOne(ctx);



        return {
            id: data.documentId,
            title: data.title,
            mainImage: data.mainImage,
            description: data.description
        };
    }
}));

