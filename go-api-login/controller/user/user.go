package user

import (
	"net/http"
	"project/rapi/orm"

	"github.com/gin-gonic/gin"
)

func ReadAll(c *gin.Context) {
	var users []orm.Userlgs
	orm.Db.Find(&users)
	c.JSON(http.StatusOK, gin.H{"status": "ok", "message": "User Readall Success", "users": users})

}

func Profile(c *gin.Context) {
	userId := c.MustGet("userId").(float64)
	var user []orm.Userlgs
	orm.Db.First(&user, userId)
	c.JSON(http.StatusOK, gin.H{"status": "ok", "message": "User Read Success", "user": user})

}
