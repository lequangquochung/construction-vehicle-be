import Image from "$entities/Image";
import { ErrorCode, ImageType } from "$enums/index";
import { EntityManager, getConnection } from "typeorm";

interface CreateCoverDTO {
    title: string;
    srcImage: string;
  }
  
  export async function changeCover(params: CreateCoverDTO) {
    return await getConnection().transaction(async (transaction: EntityManager) => {
      const imageRepo = transaction.getRepository(Image);
  
      const cover = await imageRepo.findOne({ type: ImageType.COVER });

      if (cover) {
        await imageRepo.update(cover.id, {
            title: params.title,
            srcImage: params.srcImage
        })
      } else {
        await imageRepo.save({
            title: params.title,
            srcImage: params.srcImage,
            type: ImageType.COVER
        });
      }
    });
  }
  
  export async function getCover() {
    return await getConnection().transaction(async (transaction: EntityManager) => {
      const imageRepo = transaction.getRepository(Image);
  
      const cover = await imageRepo.findOne({ type: ImageType.COVER });

      if (!cover) {
        return {
            srcImage: "",
            title: "",
        }
      }
      return {
        srcImage: cover.srcImage,
        title: cover.title
      }
    });
  }