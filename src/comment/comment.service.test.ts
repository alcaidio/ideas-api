import * as comment_service from "./comment.service"

import * as comment_dto from "./comment.dto"
import * as class_transformer from "class-transformer"
import * as comment_entity from "./comment.entity"
// @ponicode
describe("showAll", () => {
    let inst: any

    beforeEach(() => {
        inst = new comment_service.CommentService(undefined, undefined, undefined)
    })

    test("0", async () => {
        await inst.showAll()
    })
})

// @ponicode
describe("show", () => {
    let inst: any

    beforeEach(() => {
        inst = new comment_service.CommentService(undefined, undefined, undefined)
    })

    test("0", async () => {
        await inst.show("a85a8e6b-348b-4011-a1ec-1e78e9620782")
    })

    test("1", async () => {
        await inst.show("03ea49f8-1d96-4cd0-b279-0684e3eec3a9")
    })

    test("2", async () => {
        await inst.show("7289708e-b17a-477c-8a77-9ab575c4b4d8")
    })

    test("3", async () => {
        await inst.show("")
    })
})

// @ponicode
describe("showByIdea", () => {
    let inst: any

    beforeEach(() => {
        inst = new comment_service.CommentService(undefined, undefined, undefined)
    })

    test("0", async () => {
        await inst.showByIdea("7289708e-b17a-477c-8a77-9ab575c4b4d8", 10)
    })

    test("1", async () => {
        await inst.showByIdea("7289708e-b17a-477c-8a77-9ab575c4b4d8", 1)
    })

    test("2", async () => {
        await inst.showByIdea("7289708e-b17a-477c-8a77-9ab575c4b4d8", 16)
    })

    test("3", async () => {
        await inst.showByIdea("03ea49f8-1d96-4cd0-b279-0684e3eec3a9", 1)
    })

    test("4", async () => {
        await inst.showByIdea("03ea49f8-1d96-4cd0-b279-0684e3eec3a9", 10)
    })

    test("5", async () => {
        await inst.showByIdea("", NaN)
    })
})

// @ponicode
describe("showByUser", () => {
    let inst: any

    beforeEach(() => {
        inst = new comment_service.CommentService(undefined, undefined, undefined)
    })

    test("0", async () => {
        await inst.showByUser("a85a8e6b-348b-4011-a1ec-1e78e9620782", 32)
    })

    test("1", async () => {
        await inst.showByUser("7289708e-b17a-477c-8a77-9ab575c4b4d8", 32)
    })

    test("2", async () => {
        await inst.showByUser("7289708e-b17a-477c-8a77-9ab575c4b4d8", 256)
    })

    test("3", async () => {
        await inst.showByUser("7289708e-b17a-477c-8a77-9ab575c4b4d8", 10)
    })

    test("4", async () => {
        await inst.showByUser("03ea49f8-1d96-4cd0-b279-0684e3eec3a9", 1)
    })

    test("5", async () => {
        await inst.showByUser("", Infinity)
    })
})

// @ponicode
describe("create", () => {
    let inst: any

    beforeEach(() => {
        inst = new comment_service.CommentService(undefined, undefined, undefined)
    })

    test("0", async () => {
        let param3: any = new comment_dto.CommentDTO()
        await inst.create("^5.0.0", 9876, param3)
    })

    test("1", async () => {
        let param3: any = new comment_dto.CommentDTO()
        await inst.create("4.0.0-beta1\t", 12345, param3)
    })

    test("2", async () => {
        let param3: any = new comment_dto.CommentDTO()
        await inst.create("4.0.0-beta1\t", 9876, param3)
    })

    test("3", async () => {
        let param3: any = new comment_dto.CommentDTO()
        await inst.create("1.0.0", "da7588892", param3)
    })

    test("4", async () => {
        let param3: any = new comment_dto.CommentDTO()
        await inst.create("^5.0.0", "c466a48309794261b64a4f02cfcc3d64", param3)
    })

    test("5", async () => {
        let param3: any = new comment_dto.CommentDTO()
        await inst.create("", "", param3)
    })
})

// @ponicode
describe("destroy", () => {
    let inst: any

    beforeEach(() => {
        inst = new comment_service.CommentService(undefined, undefined, undefined)
    })

    test("0", async () => {
        await inst.destroy("7289708e-b17a-477c-8a77-9ab575c4b4d8", 12345)
    })

    test("1", async () => {
        await inst.destroy("7289708e-b17a-477c-8a77-9ab575c4b4d8", "c466a48309794261b64a4f02cfcc3d64")
    })

    test("2", async () => {
        await inst.destroy("a85a8e6b-348b-4011-a1ec-1e78e9620782", "da7588892")
    })

    test("3", async () => {
        await inst.destroy("03ea49f8-1d96-4cd0-b279-0684e3eec3a9", 12345)
    })

    test("4", async () => {
        await inst.destroy("a85a8e6b-348b-4011-a1ec-1e78e9620782", "bc23a9d531064583ace8f67dad60f6bb")
    })

    test("5", async () => {
        await inst.destroy("", "")
    })
})

// @ponicode
describe("toResponseObject", () => {
    let inst: any

    beforeEach(() => {
        inst = new comment_service.CommentService(undefined, undefined, undefined)
    })

    test("0", () => {
        let callFunction: any = () => {
            inst.toResponseObject(class_transformer.plainToClass(comment_entity.CommentEntity,{ comment: "foo bar" }))
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction: any = () => {
            inst.toResponseObject(class_transformer.plainToClass(comment_entity.CommentEntity,{ comment: "Hello, world!" }))
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction: any = () => {
            inst.toResponseObject(class_transformer.plainToClass(comment_entity.CommentEntity,{ comment: "Foo bar" }))
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction: any = () => {
            inst.toResponseObject(class_transformer.plainToClass(comment_entity.CommentEntity,{ comment: "This is a Text" }))
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction: any = () => {
            inst.toResponseObject(class_transformer.plainToClass(comment_entity.CommentEntity,{ comment: "" }))
        }
    
        expect(callFunction).not.toThrow()
    })
})
