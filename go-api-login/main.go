package main

import (
	"fmt"
	"net/http"
	Authcontroller "project/rapi/controller/auth"
	Usercontroller "project/rapi/controller/user"
	"project/rapi/middleware"

	"project/rapi/orm"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"gorm.io/gorm"
)

type Register struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
	Fullname string `json:"fullname" binding:"required"`
	Avatar   string `json:"avatar" binding:"required"`
}

type Userlgs struct {
	gorm.Model
	Username string
	Password string
	Fullname string
	Avatar   string
}

func main() {
	err := godotenv.Load(".env")

	if err != nil {
		fmt.Println("Error loading .env file")
	}
	orm.InitDB()
	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{"http://localhost:3000"},
		AllowMethods: []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders: []string{"Content-Type,access-control-allow-origin, access-control-allow-headers", "Authorization"},
	}))
	r.POST("/register", Authcontroller.Registerf)
	r.POST("/login", Authcontroller.Lognif)
	authorized := r.Group("/users", middleware.JWTAuthen())
	authorized.GET("/readall", Usercontroller.ReadAll)
	authorized.GET("/profile", Usercontroller.Profile)
	r.GET("/users", func(c *gin.Context) {
		var users []orm.Userlgs
		orm.Db.Find(&users)
		c.JSON(200, users)
	})
	r.GET("/users/:id", func(c *gin.Context) {
		id := c.Param("id")
		var user orm.Userlgs
		orm.Db.First(&user, id)
		c.JSON(200, user)
	})
	r.POST("/users", func(c *gin.Context) {
		var user orm.Userlgs
		if err := c.ShouldBindJSON(&user); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		result := orm.Db.Create(&user)
		c.JSON(200, gin.H{"RowsAffected": result.RowsAffected})
	})
	r.DELETE("/users/:id", func(c *gin.Context) {
		id := c.Param("id")
		var user orm.Userlgs
		orm.Db.First(&user, id)
		orm.Db.Delete(&user)
		c.JSON(200, user)
	})
	r.PUT("/users", func(c *gin.Context) {
		var user orm.Userlgs
		var updatedUser orm.Userlgs
		if err := c.ShouldBindJSON(&user); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		orm.Db.First(&updatedUser, user.ID)
		updatedUser.Fullname = user.Fullname
		updatedUser.Username = user.Username
		updatedUser.Avatar = user.Avatar
		orm.Db.Save(updatedUser)
		c.JSON(200, updatedUser)
	})

	r.Run("localhost:8080")
}
